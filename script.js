// -------------------- Firebase Initialization --------------------
const firebaseConfig = {
    apiKey: "AIzaSyC06HU3DBRSCBhy3ghSaXvJYSDAvj_7dus",
    authDomain: "expensesmanager-71abe.firebaseapp.com",
    projectId: "expensesmanager-71abe",
    storageBucket: "expensesmanager-71abe.firebasestorage.app",
    messagingSenderId: "636023942496",
    appId: "1:636023942496:web:1ceaaf5390ad3409bac205",
    measurementId: "G-PTJXWW1PXX"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const analytics = firebase.getAnalytics(app);
const database = firebase.database();

// -------------------- Welcome User --------------------
function setUsername(name) {
    localStorage.setItem('username', name);
    document.getElementById('welcomeMsg').innerText = `Welcome ${name}`;
}

let username = localStorage.getItem('username');
if (!username) {
    username = prompt("Enter your name:") || "User";
    setUsername(username);
} else {
    setUsername(username);
}

document.getElementById('changeNameBtn').addEventListener('click', () => {
    const newName = prompt("Enter your new name:") || "User";
    setUsername(newName);
    loadEntries(); // Reload data from Firebase for new user
});

// -------------------- Set today's date --------------------
document.getElementById("date").valueAsDate = new Date();

// -------------------- Categories and Colors --------------------
const incomeCats = ["Salary","Bonus","Saving from Field","Profit from IPO","Profit from Secondary Market","Indrive","Other Income"];
const expenseCats = ["Bike: Fuel","Bike: Servicing","Bike: Renewal","Bike: Insurance",
                     "Scooter: Servicing","Scooter: Renewal","Scooter: Insurance",
                     "Clothing","Food","Travel","Hospital","Internet","Futsal",
                     "College Fee","Bank Charge","Charity","Other Expense"];
const greenShades = ["#4CAF50", "#66BB6A", "#81C784", "#388E3C", "#2E7D32", "#1B5E20", "#A5D6A7"];
const redShades = ["#C62828", "#E53935", "#EF5350", "#B71C1C", "#FFCDD2", "#D32F2F", "#F44336"];

// -------------------- Entries --------------------
let entries = [];

// -------------------- Load Entries from Firebase --------------------
function loadEntries() {
    database.ref('users/' + username + '/entries').once('value', snapshot => {
        if(snapshot.exists()) {
            entries = snapshot.val();
        } else {
            entries = [];
        }
        render();
    });
}

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

        if(entry.type === "income") {
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

    // Save entries to Firebase
    database.ref('users/' + username + '/entries').set(entries);

    // Chart
    const ctx = document.getElementById("pieChart").getContext("2d");
    if(window.myPieChart) {
        window.myPieChart.destroy();
        window.myPieChart = null;
    }
    if(entries.length === 0) return;

    const chartData = {};
    entries.forEach(entry => {
        chartData[entry.category] = (chartData[entry.category] || 0) + Number(entry.amount);
    });

    const labels = Object.keys(chartData);
    const data = Object.values(chartData);

    const colorMap = {};
    labels.forEach(label => {
        if (incomeCats.includes(label)) colorMap[label] = greenShades[incomeCats.indexOf(label) % greenShades.length];
        else if (expenseCats.includes(label)) colorMap[label] = redShades[expenseCats.indexOf(label) % redShades.length];
        else colorMap[label] = "#CCCCCC";
    });
    const backgroundColors = labels.map(label => colorMap[label]);

    window.myPieChart = new Chart(ctx, {
        type: 'doughnut',
        data: { labels, datasets: [{ data, backgroundColor: backgroundColors, cutout: '50%' }] },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

// -------------------- Add Entry --------------------
document.getElementById("addBtn").addEventListener("click", () => {
    const date = document.getElementById("date").value;
    const desc = document.getElementById("desc").value.trim();
    const amount = Number(document.getElementById("amount").value);
    const type = document.getElementById("type").value;
    const category = document.getElementById("category").value.trim();

    if(!date || !desc || !category || isNaN(amount) || amount <= 0)
        return alert("Enter valid date, description, category, and amount");

   // Save entry locally
entries.push({date, desc, amount, type, category});
render();

// ✅ Also save to Firebase
firebase.database().ref("entries").push({
    date: date,
    desc: desc,
    amount: amount,
    type: type,
    category: category,
    user: username   // so we know who added it
});

//Clear Inputs
    document.getElementById("date").valueAsDate = new Date();
    document.getElementById("desc").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("category").value = "";
});

// -------------------- Edit / Remove --------------------
function editEntry(index) {
    const entry = entries[index];

    document.getElementById("date").value = entry.date;
    document.getElementById("desc").value = entry.desc;
    document.getElementById("amount").value = entry.amount;
    document.getElementById("type").value = entry.type;
    document.getElementById("category").value = entry.category;

    const addBtn = document.getElementById("addBtn");
    addBtn.innerText = "Update";

    const newBtn = addBtn.cloneNode(true);
    addBtn.parentNode.replaceChild(newBtn, addBtn);

    newBtn.addEventListener("click", () => {
        const date = document.getElementById("date").value;
        const desc = document.getElementById("desc").value.trim();
        const amount = Number(document.getElementById("amount").value);
        const type = document.getElementById("type").value;
        const category = document.getElementById("category").value.trim();

        if(!date || !desc || !category || isNaN(amount) || amount <= 0)
            return alert("Enter valid date, description, category, and amount");

        entries[index] = {date, desc, amount, type, category};
        render();

        document.getElementById("date").valueAsDate = new Date();
        document.getElementById("desc").value = "";
        document.getElementById("amount").value = "";
        document.getElementById("category").value = "";
        newBtn.innerText = "Add";
        newBtn.addEventListener("click", () => { document.getElementById("addBtn").click(); });
    });
}

function removeEntry(index) {
    entries.splice(index, 1);
    render();
}

function confirmRemove(index) {
    if(confirm(`Remove "${entries[index].desc}"?`)) removeEntry(index);
}

// -------------------- Navigation --------------------
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.style.display='none');
    const page = document.getElementById(pageId);
    if(page) page.style.display='block';
}

document.getElementById('homeLink').addEventListener('click', e => { e.preventDefault(); showPage('homePage'); });
document.getElementById('expensesLink').addEventListener('click', e => { e.preventDefault(); showPage('expenseSection'); });
document.getElementById('contactLink').addEventListener('click', e => { e.preventDefault(); showPage('contactSection'); });

//
