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

// Keep track of all users
let allUsers = JSON.parse(localStorage.getItem("allUsers")) || [];
if (!allUsers.includes(username)) {
    allUsers.push(username);
    localStorage.setItem("allUsers", JSON.stringify(allUsers));
}

// Helper to add a user to list
function addUserToList(name) {
    if (!allUsers.includes(name)) {
        allUsers.push(name);
        localStorage.setItem("allUsers", JSON.stringify(allUsers));
    }
}
let editingIndex = null;
let dateDescending = true; // default: newest first


// Change name button
// Change name button
document.getElementById('changeNameBtn').addEventListener('click', () => {
    const newName = prompt("Enter your new name:") || "User";

    if (newName === username) return; // same name, do nothing

    // Transfer old entries to new name
    const oldEntries = JSON.parse(localStorage.getItem(`entries_${username}`)) || [];
    localStorage.setItem(`entries_${newName}`, JSON.stringify(oldEntries));

    // Transfer categories
    const oldIncomeCats = JSON.parse(localStorage.getItem(`incomeCats_${username}`)) || [];
    const oldExpenseCats = JSON.parse(localStorage.getItem(`expenseCats_${username}`)) || [];
    localStorage.setItem(`incomeCats_${newName}`, JSON.stringify(oldIncomeCats));
    localStorage.setItem(`expenseCats_${newName}`, JSON.stringify(oldExpenseCats));

    // Remove old username from allUsers array
    allUsers = allUsers.filter(u => u !== username);
    addUserToList(newName); // add new name
    localStorage.setItem("allUsers", JSON.stringify(allUsers));

    // Update current username
    username = newName;
    setUsername(newName);

    // Load data for new username (transferred)
    loadUserData(newName);
});


// -------------------- Reset Data Button --------------------
const resetBtn = document.getElementById('resetBtn');

resetBtn.addEventListener('click', () => {
    if (confirm("Are you sure you want to reset all data?")) {
        resetAllData();
    }
});
// -------------------- Switch User Button --------------------
switchUserBtn.addEventListener('click', () => {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.background = "rgba(0,0,0,0.6)";
    modal.style.display = "flex";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";
    modal.style.zIndex = "9999";

    // Create container card
    const container = document.createElement('div');
    container.style.background = "#fff";
    container.style.padding = "30px 40px";
    container.style.borderRadius = "15px";
    container.style.boxShadow = "0 10px 30px rgba(0,0,0,0.3)";
    container.style.textAlign = "center";
    container.style.width = "400px";
    container.style.maxWidth = "90%";
    modal.appendChild(container);

    // Title
    const title = document.createElement('h2');
    title.innerText = "Switch User";
    title.style.marginBottom = "25px";
    title.style.color = "#333";
    title.style.fontFamily = "Arial, sans-serif";
    container.appendChild(title);

    // Users list container
    const usersList = document.createElement('div');
    usersList.style.textAlign = "left";
    usersList.style.maxHeight = "250px";
    usersList.style.overflowY = "auto";
    usersList.style.marginBottom = "20px";
    container.appendChild(usersList);

    // Create user rows
    allUsers.forEach(user => {
        const userRow = document.createElement('div');
        userRow.style.display = "flex";
        userRow.style.justifyContent = "space-between";
        userRow.style.alignItems = "center";
        userRow.style.padding = "8px 0";
        userRow.style.borderBottom = "1px solid #eee";

        const nameSpan = document.createElement('span');
        nameSpan.innerText = user === username ? `${user} (Current)` : user;
        nameSpan.style.fontWeight = user === username ? "bold" : "normal";
        nameSpan.style.color = "#555";

        const buttonsDiv = document.createElement('div');

        if (user !== username) {
            // Switch button
            const switchBtn = document.createElement('button');
            switchBtn.innerText = "Switch";
            switchBtn.style.marginRight = "8px";
            switchBtn.style.padding = "5px 12px";
            switchBtn.style.border = "none";
            switchBtn.style.borderRadius = "6px";
            switchBtn.style.backgroundColor = "#4CAF50";
            switchBtn.style.color = "#fff";
            switchBtn.style.cursor = "pointer";
            switchBtn.style.transition = "0.3s";
            switchBtn.onmouseover = () => switchBtn.style.opacity = "0.8";
            switchBtn.onmouseout = () => switchBtn.style.opacity = "1";
            switchBtn.onclick = () => {
                username = user;
                addUserToList(user);
                localStorage.setItem("username", user);
                setUsername(user);
                loadUserData(user);
                document.body.removeChild(modal);
            };

            // Remove button
            const removeBtn = document.createElement('button');
            removeBtn.innerText = "Remove";
            removeBtn.style.padding = "5px 12px";
            removeBtn.style.border = "none";
            removeBtn.style.borderRadius = "6px";
            removeBtn.style.backgroundColor = "#F44336";
            removeBtn.style.color = "#fff";
            removeBtn.style.cursor = "pointer";
            removeBtn.style.transition = "0.3s";
            removeBtn.onmouseover = () => removeBtn.style.opacity = "0.8";
            removeBtn.onmouseout = () => removeBtn.style.opacity = "1";
            removeBtn.onclick = () => {
                if (confirm(`Are you sure you want to remove user "${user}"?`)) {
                    allUsers = allUsers.filter(u => u !== user);
                    localStorage.setItem("allUsers", JSON.stringify(allUsers));
                    userRow.remove();
                }
            };

            buttonsDiv.appendChild(switchBtn);
            buttonsDiv.appendChild(removeBtn);
        }

        userRow.appendChild(nameSpan);
        userRow.appendChild(buttonsDiv);
        usersList.appendChild(userRow);
    });

    // Add new user button
    const addNewBtn = document.createElement('button');
    addNewBtn.innerText = "➕ Add New User";
    addNewBtn.style.width = "100%";
    addNewBtn.style.marginTop = "15px";
    addNewBtn.style.padding = "12px";
    addNewBtn.style.border = "none";
    addNewBtn.style.borderRadius = "8px";
    addNewBtn.style.backgroundColor = "#2196F3";
    addNewBtn.style.color = "#fff";
    addNewBtn.style.fontSize = "16px";
    addNewBtn.style.cursor = "pointer";
    addNewBtn.style.transition = "0.3s";
    addNewBtn.onmouseover = () => addNewBtn.style.opacity = "0.8";
    addNewBtn.onmouseout = () => addNewBtn.style.opacity = "1";
    addNewBtn.onclick = () => {
        const newUser = prompt("Enter new username:") || "User";
        username = newUser;
        addUserToList(newUser);
        localStorage.setItem("username", newUser);
        setUsername(newUser);
        loadUserData(newUser);
        document.body.removeChild(modal);
    };
    container.appendChild(addNewBtn);

    // Cancel button
    const cancelBtn = document.createElement('button');
    cancelBtn.innerText = "❌ Cancel";
    cancelBtn.style.marginTop = "12px";
    cancelBtn.style.width = "100%";
    cancelBtn.style.padding = "12px";
    cancelBtn.style.border = "1px solid #ccc";
    cancelBtn.style.borderRadius = "8px";
    cancelBtn.style.backgroundColor = "#fff";
    cancelBtn.style.color = "#333";
    cancelBtn.style.fontSize = "16px";
    cancelBtn.style.cursor = "pointer";
    cancelBtn.style.transition = "0.3s";
    cancelBtn.onmouseover = () => cancelBtn.style.backgroundColor = "#f2f2f2";
    cancelBtn.onmouseout = () => cancelBtn.style.backgroundColor = "#fff";
    cancelBtn.onclick = () => document.body.removeChild(modal);
    container.appendChild(cancelBtn);

    document.body.appendChild(modal);
});


// Function to load user-specific data
function loadUserData(username) {
    // Try to get entries for this user
   const savedEntries = JSON.parse(localStorage.getItem(`entries_${username}`));
if (savedEntries) {
    entries = savedEntries;
} else {
    entries = [];
    localStorage.setItem(`entries_${username}`, JSON.stringify(entries)); // <-- ADD THIS
}

    // Save categories separately if needed
    const savedIncomeCats = JSON.parse(localStorage.getItem(`incomeCats_${username}`));
    const savedExpenseCats = JSON.parse(localStorage.getItem(`expenseCats_${username}`));
    if (savedIncomeCats) incomeCats = savedIncomeCats;
    if (savedExpenseCats) expenseCats = savedExpenseCats;

    refreshCategoryDropdown();
    render();
}


// Function to reset all data
function resetAllData() {
    // Clear main tables
    document.querySelector("#incomeTable tbody").innerHTML = '';
    document.querySelector("#expenseTable tbody").innerHTML = '';
    
    // Clear top 3 tables
    document.querySelector("#topIncomeTable tbody").innerHTML = '';
    document.querySelector("#topExpenseTable tbody").innerHTML = '';

    // Reset summary cards
    document.getElementById("totalIncome").innerText = '0';
    document.getElementById("totalExpense").innerText = '0';
    document.getElementById("balance").innerText = '0';

    // Reset chart
    renderChart(); // redraw chart empty

    // Clear entries array and localStorage
    entries = [];
    localStorage.removeItem(`entries_${username}`);

    // Reset categories to default
    incomeCats = ["Salary","Bonus","Saving","Interest"];
    expenseCats = ["Rent","Food","Medicine","Insurance","Transport","Clothing","Internet","Fees","Entertainment","Charity"];
    
    // Save defaults to localStorage
    localStorage.setItem(`incomeCats_${username}`, JSON.stringify(incomeCats));
    localStorage.setItem(`expenseCats_${username}`, JSON.stringify(expenseCats));

    // Refresh dropdown
    refreshCategoryDropdown();
}



// -------------------- Set today's date in date input --------------------
document.getElementById("date").valueAsDate = new Date();

// -------------------- Data Arrays --------------------
// Load saved categories from localStorage or use default
let incomeCats = JSON.parse(localStorage.getItem(`incomeCats_${username}`)) || ["Salary","Bonus","Saving","Interest"];
let expenseCats = JSON.parse(localStorage.getItem(`expenseCats_${username}`)) || ["Rent","Food","Medicine","Insurance","Transport","Clothing","Internet","Fees","Entertainment","Charity"];

const greenShades = ["#4CAF50", "#66BB6A", "#81C784", "#388E3C", "#2E7D32", "#1B5E20", "#A5D6A7"];
const redShades = ["#C62828", "#E53935", "#EF5350", "#B71C1C", "#FFCDD2", "#D32F2F", "#F44336"];

// -------------------- Load Entries --------------------
let entries = JSON.parse(localStorage.getItem(`entries_${username}`)) || [];

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
          localStorage.setItem(`incomeCats_${username}`, JSON.stringify(incomeCats));
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
            localStorage.setItem(`expenseCats_${username}`, JSON.stringify(expenseCats));
        }
        refreshCategoryDropdown();
        categorySelect.value = newCat || "";
        return;
    }

   // Remove income category
if (value === "__remove_income__") {
    const catToRemove = prompt("Enter income category to remove:");
    if (catToRemove) {
        const foundIndex = incomeCats.findIndex(c => c.toLowerCase() === catToRemove.toLowerCase());
       if (foundIndex !== -1) {
    incomeCats.splice(foundIndex, 1);

            localStorage.setItem(`incomeCats_${username}`, JSON.stringify(incomeCats));
        } else {
            alert("Invalid category or cannot remove 'Other'");
        }
    }
    refreshCategoryDropdown();
    categorySelect.value = "";
    return;
}

// Remove expense category
if (value === "__remove_expense__") {
    const catToRemove = prompt("Enter expense category to remove:");
    if (catToRemove) {
        const foundIndex = expenseCats.findIndex(c => c.toLowerCase() === catToRemove.toLowerCase());
      if (foundIndex !== -1) {
    expenseCats.splice(foundIndex, 1);

            localStorage.setItem(`expenseCats_${username}`, JSON.stringify(expenseCats));
        } else {
            alert("Invalid category or cannot remove 'Other'");
        }
    }
    refreshCategoryDropdown();
    categorySelect.value = "";
    return;
}

 // Auto-set type based on category
    if (!["__add_income__","__add_expense__","__remove_income__","__remove_expense__"].includes(value)) {
        if (incomeCats.includes(value)) document.getElementById("type").value = "income";
        else if (expenseCats.includes(value)) document.getElementById("type").value = "expense";
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


  const sortedEntries = [...entries].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateDescending ? dateB - dateA : dateA - dateB;
});

sortedEntries.forEach((entry) => {

        const originalIndex = entries.indexOf(entry);

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${entry.date}</td>
            <td>${entry.desc}</td>
            <td>${entry.category}</td>
            <td>${entry.amount}</td>
            <td class="action-cell">
    <button class="edit-btn" onclick="editEntry(${originalIndex})">Edit</button>
    <button class="remove-btn" onclick="confirmRemove(${originalIndex})">Remove</button>
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

    // ---------------- Top 3 Incomes & Expenses ----------------
const topIncomeTbody = document.querySelector("#topIncomeTable tbody");
const topExpenseTbody = document.querySelector("#topExpenseTable tbody");

const topIncomes = entries
    .filter(e => e.type === "income")
    .sort((a,b) => b.amount - a.amount)
    .slice(0,3);

const topExpenses = entries
    .filter(e => e.type === "expense")
    .sort((a,b) => b.amount - a.amount)
    .slice(0,3);

topIncomeTbody.innerHTML = "";
topExpenseTbody.innerHTML = "";

topIncomes.forEach(e => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${e.date}</td><td>${e.category}</td><td>${e.amount}</td>`;
    topIncomeTbody.appendChild(tr);
});

topExpenses.forEach(e => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${e.date}</td><td>${e.category}</td><td>${e.amount}</td>`;
    topExpenseTbody.appendChild(tr);
});

    // Save latest entries to localStorage
   localStorage.setItem(`entries_${username}`, JSON.stringify(entries));

    renderChart();
}

document.getElementById("addBtn").addEventListener("click", () => {
    let date =  document.getElementById("date").value;
    if (!date) date= new Date().toISOString().split('T')[0]; //default today
    const desc = document.getElementById("desc").value.trim();
    const amount = Number(document.getElementById("amount").value);
    const type = document.getElementById("type").value;
    const category = document.getElementById("category").value;

    if (!desc || !category || isNaN(amount) || amount <= 0) 
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
            beforeDraw: chart=>{
                const {ctx, chartArea:{top,bottom,left,right}} = chart;
                const centerX = left+(right-left)/2;
                const centerY = top+(bottom-top)/2;
                const innerRadius = chart.getDatasetMeta(0).data[0].innerRadius;
                const radius = innerRadius*0.95;
                const formattedBalance = Number(balance).toFixed(2); // max 2 digits after decimal

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
 // Draw "Balance" text
    ctx.font = `${radius/4}px Arial`;
    ctx.fillText("Balance", centerX, centerY - radius/6);

    // Dynamically calculate font size for balance amount
    let fontSize = radius / 2.2;
    ctx.font = `${fontSize}px Arial`;
    let textWidth = ctx.measureText(formattedBalance).width;

    while(textWidth > radius * 1.6) { // shrink until it fits
        fontSize -= 1;
        ctx.font = `${fontSize}px Arial`;
        textWidth = ctx.measureText(formattedBalance).width;
    }

    ctx.fillText(formattedBalance, centerX, centerY + radius/6);
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

document.getElementById("dateSortBtn").addEventListener("click", () => {
    dateDescending = !dateDescending; // toggle ascending/descending
    document.getElementById("dateSortBtn").innerText = dateDescending ? "⬆" : "⬇";
    render(); // re-render table with new order
});


document.getElementById('homeLink').addEventListener('click', e=>{e.preventDefault();showPage('homePage');});
document.getElementById('expensesLink').addEventListener('click', e=>{e.preventDefault();showPage('expenseSection');});
document.getElementById('contactLink').addEventListener('click', e=>{e.preventDefault();showPage('contactSection');});

// -------------------- Initial Render --------------------
document.getElementById("date").valueAsDate = new Date();
render();
showPage('expenseSection');
