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
            class="penaltyReason"
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


// =========================
// SAVE PDF
// =========================

function savePDF() {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    let y = 20;

    doc.setFont("helvetica","bold");
    doc.setFontSize(20);
    doc.text("TiAmo Relaxation Spa",20,y);

    y += 10;

    doc.setFontSize(15);
    doc.text("Therapist Service Invoice",20,y);

    y += 15;

    doc.setFont("helvetica","normal");
    doc.setFontSize(11);

    doc.text("Invoice #: " + document.getElementById("invoice").value,20,y);

    y += 8;

    doc.text("Date: " + document.getElementById("date").value,20,y);

    y += 8;

    doc.text("Therapist: " + document.getElementById("therapist").value,20,y);

    y += 8;

    doc.text("Payment Week: " + document.getElementById("week").value,20,y);

    y += 15;

    doc.setFont("helvetica","bold");
    doc.text("Commission Earned",20,y);

    y += 8;

    document.querySelectorAll("#days tr").forEach(row=>{

        const day = row.cells[0].innerText;
        const amount = row.querySelector("input").value || 0;

        doc.setFont("helvetica","normal");
        doc.text(day + ": R " + amount,25,y);

        y += 7;

    });

    y += 5;

    doc.setFont("helvetica","bold");
    doc.text("Deductions",20,y);

    y += 8;

    doc.setFont("helvetica","normal");

    doc.text("Levy: R " + document.getElementById("levy").value,25,y);

    y += 7;

    doc.text("Ads: R " + document.getElementById("ads").value,25,y);

    y += 12;

    doc.setFont("helvetica","bold");
    doc.text("Penalties",20,y);

    y += 8;

    const penaltyRows = document.querySelectorAll(".pen");

    if(penaltyRows.length===0){

        doc.setFont("helvetica","normal");
        doc.text("None",25,y);

        y += 7;

    }else{

        penaltyRows.forEach(row=>{

            const date = row.children[0].value;
            const reason = row.children[1].value;
            const amount = row.children[2].value;

            doc.setFont("helvetica","normal");
            doc.text(date + " | " + reason + " | R " + amount,25,y);

            y += 7;

        });

    }

    y += 10;

    doc.setFont("helvetica","bold");

    doc.text("Total Commission: R " + document.getElementById("tc").innerText,20,y);

    y += 8;

    doc.text("Total Deductions: R " + document.getElementById("td").innerText,20,y);

    y += 8;

    doc.text("Total Penalties: R " + document.getElementById("tp").innerText,20,y);

    y += 8;

    doc.setFontSize(16);

    doc.text("NET PAYABLE: R " + document.getElementById("net").innerText,20,y);

    const therapist = document.getElementById("therapist").value || "Therapist";

    const invoice = document.getElementById("invoice").value;

    doc.save(`Invoice-${therapist}-${invoice}.pdf`);

}
