let editingIndex = null;

// -------------------- Welcome User --------------------
function setUsername(name) {
    localStorage.setItem('username', name);
    document.getElementById('welcomeMsg').innerText = `Welcome ${name}`;
}

// Initial load
let username = localStorage.getItem('username');
if (!username) {
    username = prompt("Enter your name:") || "User";
    setUsername(username);
} else {
    setUsername(username);
}

// Change name button
document.getElementById('changeNameBtn').addEventListener('click', () => {
    const newName = prompt("Enter your new name:") || "User";
    setUsername(newName);
});

// -------------------- Set today's date in date input --------------------
document.getElementById("date").valueAsDate = new Date();

// -------------------- Data Arrays --------------------
// Load saved categories from localStorage or use default
let incomeCats = JSON.parse(localStorage.getItem('incomeCats')) || ["Salary","Bonus","Saving","Interest","Other"];
let expenseCats = JSON.parse(localStorage.getItem('expenseCats')) || ["Rent","Food","Medicine","Insurance","Transport","Clothing","Internet","Fees","Entertainment","Charity","Other"];


const greenShades = ["#4CAF50", "#66BB6A", "#81C784", "#388E3C", "#2E7D32", "#1B5E20", "#A5D6A7"];
const redShades = ["#C62828", "#E53935", "#EF5350", "#B71C1C", "#FFCDD2", "#D32F2F", "#F44336"];

// -------------------- Load Entries --------------------
let entries = JSON.parse(localStorage.getItem('entries')) || [];

// -------------------- Category Management --------------------
const categorySelect = document.getElementById("category");

function refreshCategoryDropdown() {
    categorySelect.innerHTML = '<option value="">Select Category</option>';

    // Income options
    const incomeGroup = document.createElement("optgroup");
    incomeGroup.label = "Income";
    incomeCats.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.text = cat;
        incomeGroup.appendChild(option);
    });
    const addIncomeOption = document.createElement("option");
    addIncomeOption.value = "__add_income__";
    addIncomeOption.text = "+ Add Category";
    incomeGroup.appendChild(addIncomeOption);
    const removeIncomeOption = document.createElement("option");
    removeIncomeOption.value = "__remove_income__";
    removeIncomeOption.text = "− Remove Category";
    incomeGroup.appendChild(removeIncomeOption);
    categorySelect.appendChild(incomeGroup);

    // Expense options
    const expenseGroup = document.createElement("optgroup");
    expenseGroup.label = "Expenses";
    expenseCats.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.text = cat;
        expenseGroup.appendChild(option);
    });
    const addExpenseOption = document.createElement("option");
    addExpenseOption.value = "__add_expense__";
    addExpenseOption.text = "+ Add Category";
    expenseGroup.appendChild(addExpenseOption);
    const removeExpenseOption = document.createElement("option");
    removeExpenseOption.value = "__remove_expense__";
    removeExpenseOption.text = "− Remove Category";
    expenseGroup.appendChild(removeExpenseOption);
    categorySelect.appendChild(expenseGroup);
}

// Initial load
refreshCategoryDropdown();

// Handle category changes
categorySelect.addEventListener("change", () => {
    const value = categorySelect.value;

    // Add new income category
    if (value === "__add_income__") {
        const newCat = prompt("Enter new Income category:");
        if (newCat && !incomeCats.includes(newCat)) {
            incomeCats.push(newCat);
            localStorage.setItem('incomeCats', JSON.stringify(incomeCats));
        }
        refreshCategoryDropdown();
        categorySelect.value = newCat || "";
        return;
    }

    // Add new expense category
    if (value === "__add_expense__") {
        const newCat = prompt("Enter new Expense category:");
        if (newCat && !expenseCats.includes(newCat)) {
            expenseCats.push(newCat);
            localStorage.setItem('expenseCats', JSON.stringify(expenseCats));
        }
        refreshCategoryDropdown();
        categorySelect.value = newCat || "";
        return;
    }

    // Remove income category
    if (value === "__remove_income__") {
        const catToRemove = prompt("Enter income category to remove:");
        if (catToRemove && incomeCats.includes(catToRemove) && catToRemove !== "Other") {
            incomeCats.splice(incomeCats.indexOf(catToRemove), 1);
            localStorage.setItem('incomeCats', JSON.stringify(incomeCats));
        } else {
            alert("Invalid category or cannot remove 'Other'");
        }
        refreshCategoryDropdown();
        categorySelect.value = "";
        return;
    }

    // Remove expense category
    if (value === "__remove_expense__") {
        const catToRemove = prompt("Enter expense category to remove:");
        if (catToRemove && expenseCats.includes(catToRemove) && catToRemove !== "Other") {
            expenseCats.splice(expenseCats.indexOf(catToRemove), 1);
            localStorage.setItem('expenseCats', JSON.stringify(expenseCats));
        } else {
            alert("Invalid category or cannot remove 'Other'");
        }
        refreshCategoryDropdown();
        categorySelect.value = "";
        return;
    }
});

// -------------------- Render Function --------------------
function render() {
    const incomeTbody = document.querySelector("#incomeTable tbody");
    const expenseTbody = document.querySelector("#expenseTable tbody");

    incomeTbody.innerHTML = "";
    expenseTbody.innerHTML = "";

    let totalIncome = 0;
    let totalExpense = 0;

    entries.forEach((entry,index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${entry.date}</td>
            <td>${entry.desc}</td>
            <td>${entry.category}</td>
            <td>${entry.amount}</td>
            <td class="action-cell">
    <button class="edit-btn" onclick="editEntry(${index})">Edit</button>
    <button class="remove-btn" onclick="confirmRemove(${index})">Remove</button>
</td>

        `;
        if (entry.type === "income") {
            incomeTbody.appendChild(tr);
            totalIncome += Number(entry.amount);
        } else {
            expenseTbody.appendChild(tr);
            totalExpense += Number(entry.amount);
        }
    });

    document.getElementById("totalIncome").innerText = totalIncome;
    document.getElementById("totalExpense").innerText = totalExpense;
    document.getElementById("balance").innerText = totalIncome - totalExpense;

    // Save latest entries to localStorage
    localStorage.setItem('entries', JSON.stringify(entries));

    renderChart();
}

document.getElementById("addBtn").addEventListener("click", () => {
    const date = document.getElementById("date").value;
    const desc = document.getElementById("desc").value.trim();
    const amount = Number(document.getElementById("amount").value);
    const type = document.getElementById("type").value;
    const category = document.getElementById("category").value;

    if (!date || !desc || !category || isNaN(amount) || amount <= 0) 
        return alert("Enter valid date, description, category, and amount");

    if (editingIndex === null) {
        // Add new entry
        entries.push({date, desc, amount, type, category});
    } else {
        // Update existing entry
        entries[editingIndex] = {date, desc, amount, type, category};
        editingIndex = null; // reset
        document.getElementById("addBtn").innerText = "Add";
    }

    // Reset form
    document.getElementById("date").valueAsDate = new Date();
    document.getElementById("desc").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("category").value = "";

    render();
});

// ----------- Edit Entry ------------------

function editEntry(index) {
    const entry = entries[index];
    document.getElementById("date").value = entry.date;
    document.getElementById("desc").value = entry.desc;
    document.getElementById("amount").value = entry.amount;
    document.getElementById("type").value = entry.type;
    document.getElementById("category").value = entry.category;

    document.getElementById("addBtn").innerText = "Update";
    editingIndex = index; // set editing index
}


// -------------------- Remove Entry --------------------
function removeEntry(index) {
    entries.splice(index,1);
    render();
}

function confirmRemove(index) {
    if (confirm("Are you sure?")) removeEntry(index);
}

// -------------------- Doughnut Chart --------------------
function renderChart() {
    const ctx = document.getElementById("pieChart").getContext("2d");
    if (window.myPieChart) { window.myPieChart.destroy(); window.myPieChart = null; }
    if (entries.length === 0) return;

    const chartData = {};
    entries.forEach(e => chartData[e.category] = (chartData[e.category]||0)+Number(e.amount));
    const labels = Object.keys(chartData);
    const data = Object.values(chartData);

    const backgroundColors = labels.map(label => {
        if (incomeCats.includes(label)) return greenShades[incomeCats.indexOf(label)%greenShades.length];
        if (expenseCats.includes(label)) return redShades[expenseCats.indexOf(label)%redShades.length];
        return "#CCCCCC";
    });

    const totalIncome = entries.filter(e=>e.type==='income').reduce((a,b)=>a+Number(b.amount),0);
    const totalExpense = entries.filter(e=>e.type==='expense').reduce((a,b)=>a+Number(b.amount),0);
    const balance = totalIncome - totalExpense;

    window.myPieChart = new Chart(ctx, {
        type:'doughnut',
        data:{ labels, datasets:[{ data, backgroundColor:backgroundColors, cutout:'50%' }] },
        options:{ responsive:true, maintainAspectRatio:false },
        plugins:[{
            id:'balanceCenter',
            afterDraw: chart=>{
                const {ctx, chartArea:{top,bottom,left,right}} = chart;
                const centerX = left+(right-left)/2;
                const centerY = top+(bottom-top)/2;
                const innerRadius = chart.getDatasetMeta(0).data[0].innerRadius;
                const radius = innerRadius*0.95;

                ctx.save();
                ctx.beginPath();
                ctx.arc(centerX,centerY,radius,0,2*Math.PI);
                ctx.fillStyle="#FFEB3B";
                ctx.fill();
                ctx.lineWidth=2;
                ctx.strokeStyle="#000000";
                ctx.stroke();

                ctx.fillStyle="#000000";
                ctx.textAlign="center";
                ctx.textBaseline="middle";
                ctx.font=`${radius/4}px Arial`;
                ctx.fillText("Balance",centerX,centerY-radius/6);
                ctx.font=`${radius/2.2}px Arial`;
                ctx.fillText(balance,centerX,centerY+radius/6);
                ctx.restore();
            }
        }]
    });
}

// -------------------- Page Navigation --------------------
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p=>p.style.display='none');
    const page = document.getElementById(pageId);
    if(page) page.style.display='block';
}

document.getElementById('homeLink').addEventListener('click', e=>{e.preventDefault();showPage('homePage');});
document.getElementById('expensesLink').addEventListener('click', e=>{e.preventDefault();showPage('expenseSection');});
document.getElementById('contactLink').addEventListener('click', e=>{e.preventDefault();showPage('contactSection');});

// -------------------- Initial Render --------------------
document.getElementById("date").valueAsDate = new Date();
render();
showPage('expenseSection');
