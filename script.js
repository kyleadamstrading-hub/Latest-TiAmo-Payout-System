// ---------- TiAmo Therapist Invoice Script ----------

// Set today's date
document.getElementById("date").value = new Date().toISOString().split("T")[0];

// Generate invoice number
document.getElementById("invoice").value =
    "INV-" + Math.floor(100000 + Math.random() * 900000);

// Days of the week
const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
];

// Create commission rows
const daysTable = document.getElementById("days");

days.forEach(day => {

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${day}</td>
        <td>
            <input
                type="number"
                class="commission"
                value="0"
                min="0"
            >
        </td>
    `;

    daysTable.appendChild(row);

});

// Add penalty row
function addPenalty(){

    const penalties = document.getElementById("penalties");

    const row = document.createElement("div");

    row.className = "pen";

    row.innerHTML = `

        <input type="date">

        <input
            type="text"
            placeholder="Reason"
        >

        <input
            type="number"
            class="penalty"
            value="0"
            min="0"
        >

        <button
            onclick="this.parentElement.remove();calculateTotals();"
        >
            Delete
        </button>

    `;

    penalties.appendChild(row);

    attachListeners();

    calculateTotals();

}

// Calculate totals
function calculateTotals(){

    let commission = 0;

    document.querySelectorAll(".commission").forEach(input=>{

        commission += Number(input.value) || 0;

    });

    const levy =
        Number(document.getElementById("levy").value) || 0;

    const ads =
        Number(document.getElementById("ads").value) || 0;

    let penalties = 0;

    document.querySelectorAll(".penalty").forEach(input=>{

        penalties += Number(input.value) || 0;

    });

    const deductions = levy + ads;

    const net =
        commission - deductions - penalties;

    document.getElementById("tc").innerText =
        commission.toFixed(2);

    document.getElementById("td").innerText =
        deductions.toFixed(2);

    document.getElementById("tp").innerText =
        penalties.toFixed(2);

    document.getElementById("net").innerText =
        net.toFixed(2);

}

// Listen for changes
function attachListeners(){

    document.querySelectorAll("input").forEach(input=>{

        input.removeEventListener("input",calculateTotals);

        input.addEventListener("input",calculateTotals);

    });

}

attachListeners();

calculateTotals();
function savePDF() {
    window.print();
}
