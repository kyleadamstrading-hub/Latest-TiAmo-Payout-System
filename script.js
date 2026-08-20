// ---------- TiAmo Therapist Invoice Script ----------

document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // INITIAL SETUP
    // =========================

    // Set today's date
    document.getElementById("date").value =
        new Date().toISOString().split("T")[0];

    // Generate invoice number
    document.getElementById("invoice").value =
        "INV-" + Math.floor(100000 + Math.random() * 900000);


    // =========================
    // COMMISSION ENTRIES
    // =========================

    window.addCommissionEntry = function () {

        const container =
            document.getElementById("commissionEntries");

        const row =
            document.createElement("div");

        row.className = "commission-entry";

        row.innerHTML = `
            <input
                type="date"
                class="commissionDate"
            >

            <input
                type="number"
                class="commission"
                placeholder="Commission Earned (R)"
                value=""
                min="0"
                step="0.01"
            >

            <button
                type="button"
                class="delete-button"
            >
                Delete
            </button>
        `;

        // Delete button
        row.querySelector(".delete-button").addEventListener("click", function () {
            row.remove();
            calculateTotals();
        });

        container.appendChild(row);

        attachListeners();

        calculateTotals();
    };


    // =========================
    // PENALTIES
    // =========================

    window.addPenalty = function () {

        const penalties =
            document.getElementById("penalties");

        const row =
            document.createElement("div");

        row.className = "pen";

        row.innerHTML = `
            <input
                type="date"
                class="penaltyDate"
            >

            <input
                type="text"
                placeholder="Reason"
                class="penaltyReason"
            >

            <input
                type="number"
                class="penalty"
                placeholder="Amount (R)"
                value="0"
                min="0"
                step="0.01"
            >

            <button
                type="button"
                class="delete-button"
            >
                Delete
            </button>
        `;

        // Delete penalty
        row.querySelector(".delete-button").addEventListener("click", function () {
            row.remove();
            calculateTotals();
        });

        penalties.appendChild(row);

        attachListeners();

        calculateTotals();
    };


    // =========================
    // CALCULATE TOTALS
    // =========================

    window.calculateTotals = function () {

        let commission = 0;

        document.querySelectorAll(".commission").forEach(input => {

            commission += Number(input.value) || 0;

        });


        const levy =
            Number(document.getElementById("levy").value) || 0;


        const ads =
            Number(document.getElementById("ads").value) || 0;


        let penalties = 0;

        document.querySelectorAll(".penalty").forEach(input => {

            penalties += Number(input.value) || 0;

        });


        const deductions =
            levy + ads;


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
    };


    // =========================
    // INPUT LISTENERS
    // =========================

    function attachListeners() {

        document.querySelectorAll("input").forEach(input => {

            input.removeEventListener(
                "input",
                calculateTotals
            );

            input.addEventListener(
                "input",
                calculateTotals
            );

            input.removeEventListener(
                "change",
                calculateTotals
            );

            input.addEventListener(
                "change",
                calculateTotals
            );

        });
    }


    // Initial listeners
    attachListeners();

    // Initial calculation
    calculateTotals();


    // =========================
    // SAVE PDF
    // =========================

    window.savePDF = function () {

        const { jsPDF } = window.jspdf;

        const doc = new jsPDF();

        let y = 20;


        // -------------------------
        // HEADER
        // -------------------------

        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);

        doc.text(
            "TiAmo Relaxation Spa",
            20,
            y
        );

        y += 10;

        doc.setFontSize(15);

        doc.text(
            "Therapist Service Invoice",
            20,
            y
        );

        y += 15;


        // -------------------------
        // INVOICE DETAILS
        // -------------------------

        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);

        doc.text(
            "Invoice #: " +
            document.getElementById("invoice").value,
            20,
            y
        );

        y += 8;

        doc.text(
            "Date: " +
            document.getElementById("date").value,
            20,
            y
        );

        y += 8;

        doc.text(
            "Therapist: " +
            document.getElementById("therapist").value,
            20,
            y
        );

        y += 8;

        doc.text(
            "Payment Period: " +
            document.getElementById("week").value,
            20,
            y
        );

        y += 15;


        // -------------------------
        // COMMISSION
        // -------------------------

        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);

        doc.text(
            "Commission Earned",
            20,
            y
        );

        y += 8;

        doc.setFontSize(11);

        const commissionRows =
            document.querySelectorAll(".commission-entry");


        if (commissionRows.length === 0) {

            doc.setFont("helvetica", "normal");

            doc.text(
                "None",
                25,
                y
            );

            y += 7;

        } else {

            commissionRows.forEach(row => {

                const date =
                    row.querySelector(".commissionDate").value || "-";

                const amount =
                    row.querySelector(".commission").value || "0.00";

                doc.setFont("helvetica", "normal");

                doc.text(
                    date +
                    " | R " +
                    Number(amount).toFixed(2),
                    25,
                    y
                );

                y += 7;

                if (y > 270) {

                    doc.addPage();

                    y = 20;

                }

            });
        }


        y += 5;


        // -------------------------
        // CASH OUT NOTES
        // -------------------------

        doc.setFont("helvetica", "bold");

        doc.text(
            "Advance / Cash Out Notes",
            20,
            y
        );

        y += 8;

        doc.setFont("helvetica", "normal");

        const notes =
            document.getElementById("cashoutNotes").value;


        if (notes.trim() === "") {

            doc.text(
                "None",
                25,
                y
            );

            y += 7;

        } else {

            const noteLines =
                doc.splitTextToSize(
                    notes,
                    165
                );

            doc.text(
                noteLines,
                25,
                y
            );

            y +=
                noteLines.length * 6 + 5;
        }


        // -------------------------
        // DEDUCTIONS
        // -------------------------

        doc.setFont("helvetica", "bold");

        doc.text(
            "Deductions",
            20,
            y
        );

        y += 8;

        doc.setFont("helvetica", "normal");

        const levy =
            document.getElementById("levy").value || "0";

        const ads =
            document.getElementById("ads").value || "0";

        doc.text(
            "Levy: R " +
            Number(levy).toFixed(2),
            25,
            y
        );

        y += 7;

        doc.text(
            "Ads: R " +
            Number(ads).toFixed(2),
            25,
            y
        );

        y += 12;


        // -------------------------
        // PENALTIES
        // -------------------------

        doc.setFont("helvetica", "bold");

        doc.text(
            "Penalties",
            20,
            y
        );

        y += 8;

        doc.setFont("helvetica", "normal");

        const penaltyRows =
            document.querySelectorAll(".pen");


        if (penaltyRows.length === 0) {

            doc.text(
                "None",
                25,
                y
            );

            y += 7;

        } else {

            penaltyRows.forEach(row => {

                const date =
                    row.querySelector(".penaltyDate").value || "-";

                const reason =
                    row.querySelector(".penaltyReason").value || "-";

                const amount =
                    row.querySelector(".penalty").value || "0.00";

                const penaltyText =
                    date +
                    " | " +
                    reason +
                    " | R " +
                    Number(amount).toFixed(2);

                const lines =
                    doc.splitTextToSize(
                        penaltyText,
                        165
                    );

                doc.text(
                    lines,
                    25,
                    y
                );

                y +=
                    lines.length * 6 + 2;

                if (y > 270) {

                    doc.addPage();

                    y = 20;

                }

            });
        }


        y += 10;


        // -------------------------
        // SUMMARY
        // -------------------------

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);

        doc.text(
            "Total Commission: R " +
            document.getElementById("tc").innerText,
            20,
            y
        );

        y += 8;

        doc.text(
            "Total Deductions: R " +
            document.getElementById("td").innerText,
            20,
            y
        );

        y += 8;

        doc.text(
            "Total Penalties: R " +
            document.getElementById("tp").innerText,
            20,
            y
        );

        y += 10;

        doc.setFontSize(16);

        doc.text(
            "NET PAYABLE: R " +
            document.getElementById("net").innerText,
            20,
            y
        );


        // -------------------------
        // SAVE FILE
        // -------------------------

        const therapist =
            document.getElementById("therapist").value ||
            "Therapist";

        const invoice =
            document.getElementById("invoice").value;

        const safeTherapist =
            therapist.replace(
                /[\\/:*?"<>|]/g,
                ""
            );

        doc.save(
            `Invoice-${safeTherapist}-${invoice}.pdf`
        );

    };

});
