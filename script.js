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
const incomeCats = ["Salary","Bonus","Saving","Interest","Other"];
const expenseCats = ["Rent","Food","Medicine","Insurance","Transport","Clothing","Internet","Fees","Entertainment","Charity","Other"];

// -------------------- Category Management --------------------
const categorySelect = document.getElementById("category");

// Function to refresh category dropdown with "+ Add Category" option
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
    // Add "+ Add Category" at the end
    const addIncomeOption = document.createElement("option");
    addIncomeOption.value = "__add_income__";
    addIncomeOption.text = "+ Add Category";
    incomeGroup.appendChild(addIncomeOption);

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
    // Add "+ Add Category" at the end
    const addExpenseOption = document.createElement("option");
    addExpenseOption.value = "__add_expense__";
    addExpenseOption.text = "+ Add Category";
    expenseGroup.appendChild(addExpenseOption);

    categorySelect.appendChild(expenseGroup);

    // For Income
const removeIncomeOption = document.createElement("option");
removeIncomeOption.value = "__remove_income__";
removeIncomeOption.text = "− Remove Category";
incomeGroup.appendChild(removeIncomeOption);

// For Expense
const removeExpenseOption = document.createElement("option");
removeExpenseOption.value = "__remove_expense__";
removeExpenseOption.text = "− Remove Category";
expenseGroup.appendChild(removeExpenseOption);


}

// Initial load of categories
refreshCategoryDropdown();

// -------------------- Detect when "+ Add Category" is selected --------------------
categorySelect.addEventListener("change", () => {
    const value = categorySelect.value;

    if (value === "__add_income__") {
        const newCat = prompt("Enter new Income category:");
        if (newCat && !incomeCats.includes(newCat)) {
            incomeCats.push(newCat);
            refreshCategoryDropdown();
            categorySelect.value = newCat; // Select the new category
        } else {
            categorySelect.value = ""; // Reset selection if invalid
        }
    }

    if (value === "__add_expense__") {
        const newCat = prompt("Enter new Expense category:");
        if (newCat && !expenseCats.includes(newCat)) {
            expenseCats.push(newCat);
            refreshCategoryDropdown();
            categorySelect.value = newCat; // Select the new category
        } else {
            categorySelect.value = ""; // Reset selection if invalid
        }
    }

    categorySelect.addEventListener("change", () => {
    const value = categorySelect.value;

    // --- Add Category ---
    if (value === "__add_income__") {
        const newCat = prompt("Enter new Income category:");
        if (newCat && !incomeCats.includes(newCat)) {
            incomeCats.push(newCat);
            refreshCategoryDropdown();
            categorySelect.value = newCat;
        } else {
            categorySelect.value = "";
        }
    }

    if (value === "__add_expense__") {
        const newCat = prompt("Enter new Expense category:");
        if (newCat && !expenseCats.includes(newCat)) {
            expenseCats.push(newCat);
            refreshCategoryDropdown();
            categorySelect.value = newCat;
        } else {
            categorySelect.value = "";
        }
    }

    // --- Remove Category (Paste Here) ---
    if (value === "__remove_income__") {
        const catToRemove = prompt("Enter income category to remove:");
        if (catToRemove && incomeCats.includes(catToRemove) && catToRemove !== "Other") {
            incomeCats.splice(incomeCats.indexOf(catToRemove), 1);
            refreshCategoryDropdown();
            categorySelect.value = "";
        } else {
            alert("Invalid category or cannot remove 'Other'");
            categorySelect.value = "";
        }
    }

    if (value === "__remove_expense__") {
        const catToRemove = prompt("Enter expense category to remove:");
        if (catToRemove && expenseCats.includes(catToRemove) && catToRemove !== "Other") {
            expenseCats.splice(expenseCats.indexOf(catToRemove), 1);
            refreshCategoryDropdown();
            categorySelect.value = "";
        } else {
            alert("Invalid category or cannot remove 'Other'");
            categorySelect.value = "";
        }
    }
});


});





const greenShades = ["#4CAF50", "#66BB6A", "#81C784", "#388E3C", "#2E7D32", "#1B5E20", "#A5D6A7"];
const redShades = ["#C62828", "#E53935", "#EF5350", "#B71C1C", "#FFCDD2", "#D32F2F", "#F44336"];

// -------------------- Load Entries --------------------
let entries = JSON.parse(localStorage.getItem('entries')) || [];

// -------------------- Render Function --------------------
function render() {
    const incomeTbody = document.querySelector("#incomeTable tbody");
    const expenseTbody = document.querySelector("#expenseTable tbody");

    incomeTbody.innerHTML = "";
    expenseTbody.innerHTML = "";

    let totalIncome = 0;
    let totalExpense = 0;

    entries.forEach((entry, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${entry.date}</td>   
            <td>${entry.desc}</td>
            <td>${entry.category}</td>
            <td>${entry.amount}</td>
            <td class="action-cell">
                <button class="edit-btn" onclick="editEntry(${index})">Edit</button>
                <br>
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

    // Update summary
    document.getElementById("totalIncome").innerText = totalIncome;
    document.getElementById("totalExpense").innerText = totalExpense;
    document.getElementById("balance").innerText = totalIncome - totalExpense;

    // Always destroy previous chart before creating new
    if (window.myPieChart) {
        window.myPieChart.destroy();
        window.myPieChart = null;
    }

    // If no entries, skip chart creation
    if (entries.length === 0) {
        // Save to local storage after clearing
        localStorage.setItem('entries', JSON.stringify(entries));
        return;
    }

    // Save latest entries
    localStorage.setItem('entries', JSON.stringify(entries));

    // Always destroy previous chart before creating a new one
    if (window.myPieChart) {
        window.myPieChart.destroy();
        window.myPieChart = null;
    }

    // If no entries, don't create a chart
    if (entries.length === 0) return;

    // Save to localStorage
    localStorage.setItem('entries', JSON.stringify(entries));

    // ----------------- Doughnut Chart with Center Balance -------------------
    const ctx = document.getElementById("pieChart").getContext("2d");

    if (entries.length === 0) {
    
    if (window.myPieChart) {
        window.myPieChart.destroy();
        window.myPieChart = null;
    }
    return; // Stop here if no entries, don't build chart
}
    // Prepare data by category
    const chartData = {};
    entries.forEach(entry => {
        chartData[entry.category] = (chartData[entry.category] || 0) + Number(entry.amount);
    });

    const labels = Object.keys(chartData);
    const data = Object.values(chartData);

    // Assign colors
    const colorMap = {};
    labels.forEach(label => {
        if (incomeCats.includes(label)) colorMap[label] = greenShades[incomeCats.indexOf(label) % greenShades.length];
        else if (expenseCats.includes(label)) colorMap[label] = redShades[expenseCats.indexOf(label) % redShades.length];
        else colorMap[label] = "#CCCCCC";
    });
    const backgroundColors = labels.map(label => colorMap[label]);

    // Calculate balance
    const balance = totalIncome - totalExpense;

    window.myPieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                cutout: '50%',
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            const total = data.reduce((a,b) => a+b, 0);
                            const percentage = ((value/total)*100).toFixed(1);
                            return `${context.label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        },
plugins: [{
    id: 'balanceCenter',
    afterDatasetsDraw: function(chart) {
        const { ctx } = chart;
        const meta = chart.getDatasetMeta(0);

        const innerRadius = meta.data[0].innerRadius;
        const centerX = chart.chartArea.left + (chart.chartArea.right - chart.chartArea.left) / 2;
        const centerY = chart.chartArea.top + (chart.chartArea.bottom - chart.chartArea.top) / 2;

        const radius = innerRadius * 0.95;

        // Draw yellow circle
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fillStyle = "#FFEB3B";
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#000000";
        ctx.stroke();

        // Calculate balance
        const totalIncome = entries.filter(e => e.type === 'income').reduce((a,b)=>a+Number(b.amount),0);
        const totalExpense = entries.filter(e => e.type === 'expense').reduce((a,b)=>a+Number(b.amount),0);
        const balance = totalIncome - totalExpense;

        // Draw two lines of text
        ctx.fillStyle = "#000000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Line 1: label
        ctx.font = `${radius/4}px Arial`; // smaller
        ctx.fillText("Balance:", centerX, centerY - radius/6);

        // Line 2: amount
        ctx.font = `${radius/2.2}px Arial`; // bigger
        ctx.fillText(balance, centerX, centerY + radius/6);

        ctx.restore();
    }
}]


    });
}

// -------------------- Add Entry --------------------
document.getElementById("addBtn").addEventListener("click", () => {
    const date = document.getElementById("date").value;
    const desc = document.getElementById("desc").value.trim();
    const amount = Number(document.getElementById("amount").value);
    const type = document.getElementById("type").value;
    const category = document.getElementById("category").value.trim();

    if (!date || !desc || !category || isNaN(amount) || amount <= 0) 
        return alert("Enter valid date, description, category, and amount");

    entries.push({date, desc, amount, type, category});
    render();

    // Clear inputs
    document.getElementById("date").value = "";
    document.getElementById("desc").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("category").value = "";
});


//--------------------- Edit Entry --------------------
function editEntry(index) {
    const entry = entries[index];

    // Populate the form
    document.getElementById("date").value = entry.date;
    document.getElementById("desc").value = entry.desc;
    document.getElementById("amount").value = entry.amount;
    document.getElementById("type").value = entry.type;
    document.getElementById("category").value = entry.category;

    // Change add button to update mode
    const addBtn = document.getElementById("addBtn");
    addBtn.innerText = "Update";
    
    // Remove previous click listeners
    const newBtn = addBtn.cloneNode(true);
    addBtn.parentNode.replaceChild(newBtn, addBtn);

    newBtn.addEventListener("click", () => {
    const date = document.getElementById("date").value; // ✅ read date here
    const desc = document.getElementById("desc").value.trim();
    const amount = Number(document.getElementById("amount").value);
    const type = document.getElementById("type").value;
    const category = document.getElementById("category").value.trim();

    if (!date || !desc || !category || isNaN(amount) || amount <= 0) 
        return alert("Enter valid date, description, category, and amount");

    // Update the entry
    entries[index] = {date, desc, amount, type, category};
    render();

    // Reset form
    document.getElementById("date").valueAsDate = new Date();
    document.getElementById("desc").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("category").value = "";
    newBtn.innerText = "Add";

    // Restore original click listener
    newBtn.addEventListener("click", () => {
        document.getElementById("addBtn").click();
    });
});

}


// -------------------- Remove Entry --------------------
function removeEntry(index) {
    entries.splice(index, 1);
    render();
}

// -------------------- Confirm Remove --------------------
function confirmRemove(index) {
    const entry = entries[index];
    const confirmDelete = confirm(`Are you sure you want to remove "${entry.desc}" (${entry.amount})?`);
    if (confirmDelete) {
        removeEntry(index);
    }
}


// -------------------- Initial Render --------------------
render();

// Function to show/hide pages
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.style.display = 'none';  // Hide all pages
    });

    const pageToShow = document.getElementById(pageId);
    if (pageToShow) {
        pageToShow.style.display = 'block';  // Show the selected page
    }
}

// Event Listeners for Navigation Links
document.getElementById('homeLink').addEventListener('click', (e) => {
    e.preventDefault();  // Prevent default anchor behavior
    showPage('homePage');  // Show Home page (Coming Soon)
});

document.getElementById('expensesLink').addEventListener('click', (e) => {
    e.preventDefault();  // Prevent default anchor behavior
    showPage('expenseSection');  // Show Expenses Tracker page
});

document.getElementById('contactLink').addEventListener('click', (e) => {
    e.preventDefault();  // Prevent default anchor behavior
    showPage('contactSection');  // Show Contact Us page (Coming Soon)
});

// Default: Show the Expenses Tracker page initially
showPage('expenseSection');
