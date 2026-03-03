// Oro classinteyum Publish cheytha TSV linkukal ee bracket-il nalkuka
const SHEET_URLS = {
    "1": "https://docs.google.com/spreadsheets/d/e/2PACX-1vTJu-EDpFYXABL3Be-S-9QTqkWici-5xo9Pc9yS4BDlqulZW45ZK7WKLnWeYeWRk9bNrTD72hsLiOYF/pub?gid=203192029&single=true&output=tsv",
    "2": "https://docs.google.com/spreadsheets/d/e/2PACX-1vTJu-EDpFYXABL3Be-S-9QTqkWici-5xo9Pc9yS4BDlqulZW45ZK7WKLnWeYeWRk9bNrTD72hsLiOYF/pub?gid=557047905&single=true&output=tsv",
    "3": "https://docs.google.com/spreadsheets/d/e/2PACX-1vTJu-EDpFYXABL3Be-S-9QTqkWici-5xo9Pc9yS4BDlqulZW45ZK7WKLnWeYeWRk9bNrTD72hsLiOYF/pub?gid=1957603778&single=true&output=tsv",
    "4": "https://docs.google.com/spreadsheets/d/e/2PACX-1vTJu-EDpFYXABL3Be-S-9QTqkWici-5xo9Pc9yS4BDlqulZW45ZK7WKLnWeYeWRk9bNrTD72hsLiOYF/pub?gid=165956621&single=true&output=tsv",
    "5": "https://docs.google.com/spreadsheets/d/e/2PACX-1vTJu-EDpFYXABL3Be-S-9QTqkWici-5xo9Pc9yS4BDlqulZW45ZK7WKLnWeYeWRk9bNrTD72hsLiOYF/pub?gid=776077277&single=true&output=tsv",
    "6": "https://docs.google.com/spreadsheets/d/e/2PACX-1vTJu-EDpFYXABL3Be-S-9QTqkWici-5xo9Pc9yS4BDlqulZW45ZK7WKLnWeYeWRk9bNrTD72hsLiOYF/pub?gid=1405730072&single=true&output=tsv",
    "7": "https://docs.google.com/spreadsheets/d/e/2PACX-1vTJu-EDpFYXABL3Be-S-9QTqkWici-5xo9Pc9yS4BDlqulZW45ZK7WKLnWeYeWRk9bNrTD72hsLiOYF/pub?gid=1686456690&single=true&output=tsv",
    "8": "https://docs.google.com/spreadsheets/d/e/2PACX-1vTJu-EDpFYXABL3Be-S-9QTqkWici-5xo9Pc9yS4BDlqulZW45ZK7WKLnWeYeWRk9bNrTD72hsLiOYF/pub?gid=99018518&single=true&output=tsv",
    "9": "https://docs.google.com/spreadsheets/d/e/2PACX-1vTJu-EDpFYXABL3Be-S-9QTqkWici-5xo9Pc9yS4BDlqulZW45ZK7WKLnWeYeWRk9bNrTD72hsLiOYF/pub?gid=406511031&single=true&output=tsv",
    "10": "https://docs.google.com/spreadsheets/d/e/2PACX-1vTJu-EDpFYXABL3Be-S-9QTqkWici-5xo9Pc9yS4BDlqulZW45ZK7WKLnWeYeWRk9bNrTD72hsLiOYF/pub?gid=201167342&single=true&output=tsv"
};

const CLASS_SUBJECTS = {
    "1": ["Thafheem reading", "Thafheem writing", "Duroos reading", "Duroos writing", "Deeniyat", "Dictation"],
    "2": ["Quran", "Hifz", "Fiqh", "Lisan", "Aqeedha", "Duroos"],
    "3": ["Quran", "Hifz", "Fiqh", "Thareeq", "Lisan", "Duroos"],
    "4": ["Quran", "Hifz", "Fiqh", "Thareeq", "Lisan", "Aqeedha", "Duroos"],
    "5": ["Quran", "Hifz", "Fiqh", "Thareeq", "Aqlakh", "Thajveed", "Lisan", "Aqeedha"],
    "6": ["Quran", "Hifz", "Fiqh", "Thareeq", "Lisan", "Duroos"],
    "7": ["Quran", "Hifz", "Fiqh", "Thareeq", "Lisan", "Duroos"],
    "8": ["Fiqh", "Lisan", "Thareeq", "Duroos"],
    "9": ["Fiqh", "Lisan", "Thareeq", "Duroos"],
    "10": ["Fiqh", "Lisan", "Thafseer", "Duroos"]
};

let currentResult = null;

function getGrade(m) {
    const mark = parseFloat(m);
    if (isNaN(mark) || mark === 0) return { g: "-", s: "none" }; 
    if (mark >= 45) return { g: "A+", s: "pass" };
    if (mark >= 40) return { g: "A", s: "pass" };
    if (mark >= 35) return { g: "B+", s: "pass" };
    if (mark >= 30) return { g: "B", s: "pass" };
    if (mark >= 25) return { g: "C+", s: "pass" };
    if (mark >= 20) return { g: "C", s: "pass" };
    if (mark >= 18) return { g: "D+", s: "pass" };
    return { g: "D", s: "fail" };
}

document.getElementById("result-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const reg = document.getElementById("reg_no").value.trim().toUpperCase();
    const cls = document.getElementById("class_name").value.trim();
    const box = document.getElementById("result-display");

    const dataUrl = SHEET_URLS[cls];
    const subjectsList = CLASS_SUBJECTS[cls];

    if (!dataUrl) {
        alert("Ee classinte data ippo labhyamalla!");
        return;
    }

    box.innerHTML = "<p>Loading Result...</p>";

    try {
        const res = await fetch(dataUrl);
        const txt = await res.text();
        const rows = txt.split("\n").map(r => r.split("\t")).slice(1);

        const found = rows.find(r => r[0] && r[0].trim().toUpperCase() === reg);

        if (!found) {
            box.innerHTML = `<p class='error'>No Result Found for Reg No: ${reg}</p>`;
            document.getElementById("pdf-btn").style.display = "none";
            return;
        }

        // Hide search form
        document.getElementById("result-form").style.display = "none";
        document.querySelector("h1").style.display = "none";
        document.querySelector(".logo-wrap").style.display = "none";

        // Student object
        const student = {
            reg: found[0].trim(),
            class: found[1].trim(),
            name: found[2].trim(),
            subjects: subjectsList.map((s, i) => ({ name: s, mark: found[i + 3] ? found[i + 3].trim() : "" })),
            total: found[subjectsList.length + 3] || "0"
        };
        currentResult = student;

        let totalMarksObtained = 0;
        let subjectCount = 0;
        let isFailed = false;

        let marksHTML = student.subjects.map(s => {
            const markVal = parseFloat(s.mark);
            const gradeData = getGrade(markVal);
            if (!isNaN(markVal)) {
                totalMarksObtained += markVal;
                subjectCount++;
                if (gradeData.s === "fail") isFailed = true;
            }

            const statusColor = gradeData.s === "fail" ? "#dc3545" : "#28a745";
            return `
                <div class="mark-tile">
                    <span class="sub-name">${s.name}</span>
                    <div style="text-align: right;">
                        <span class="sub-score">${s.mark || "0"}</span>
                        <span style="font-size: 11px; font-weight: bold; margin-left: 5px; color: ${statusColor}">(${gradeData.g})</span>
                    </div>
                </div>`;
        }).join("");

        const averageMark = subjectCount > 0 ? (totalMarksObtained / subjectCount) : 0;
        const finalGradeData = getGrade(averageMark);
        const finalStatus = isFailed ? "FAILED" : "PASSED";
        const statusBg = isFailed ? "#dc3545" : "#28a745";

        box.innerHTML = `
            <div class="result-card" style="padding: 0; overflow: hidden; background: #fff; border: 1px solid #ddd; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                <div class="card-banner"><img src="header.png" alt="Header" style="width: 100%; display: block;"></div>
                <div style="padding: 20px;">
                    <div style="display: flex; justify-content: center; margin-bottom: 25px;">
                       <div style="background: #f0f4f8; border: 1.5px solid #0b3d91; padding: 10px 25px; border-radius: 15px; text-align: center;">
    <span style="color: #0b3d91; font-weight: 800; font-size: 14px; text-transform: uppercase; display: block; line-height: 1.4;">
        Annual Examination Result <br>
        <span style="font-size: 16px;">2025-26</span>
    </span>
</div>
                    </div>
                    <div class="student-info-grid">
                        <div class="info-item"><b>STUDENT NAME</b><span>${student.name}</span></div>
                        <div class="info-item"><b>REG. NO</b><span>${student.reg}</span></div>
                        <div class="info-item"><b>CLASS</b><span>${student.class}</span></div>
                        <div class="info-item"><b>RESULT</b><span style="color: ${statusBg}; font-weight: 800;">${finalStatus}</span></div>
                    </div>
                    <div class="marks-container">${marksHTML}</div>
                    <div class="total-grade-box">
                        <div class="stat-box bg-total"><small>TOTAL MARKS</small><strong>${student.total}</strong></div>
                        <div class="stat-box" style="background: ${statusBg}"><small>FINAL GRADE</small><strong>${finalGradeData.g}</strong></div>
                    </div>
                    <p style="text-align:center; font-size:10px; color:#666; margin-top:15px; border-top: 1px dashed #ccc; padding-top: 10px;">
                        Academic Year: 2025-2026 | D+ and above is Pass.
                    </p>
                </div>
            </div>
            <button onclick="location.reload()" style="margin-top: 20px; background: #eee; border: 1px solid #ccc; padding: 10px; border-radius: 8px; width: 100%; cursor: pointer;">Check Another Result</button>
        `;
        document.getElementById("pdf-btn").style.display = "block";

    } catch (err) {
        box.innerHTML = "<p class='error'>Error loading data. Please check your internet.</p>";
    }
});

// Download Image Logic (Same as before)
document.getElementById("pdf-btn").addEventListener("click", async function () {
    const btn = this;
    btn.disabled = true;
    try {
        const checkBtn = document.querySelector("button[onclick='location.reload()']");
        if(checkBtn) checkBtn.style.visibility = "hidden";
        const box = document.getElementById("result-display");
        const canvas = await html2canvas(box, { scale: 3, useCORS: true, backgroundColor: "#ffffff" });
        if(checkBtn) checkBtn.style.visibility = "visible";
        const link = document.createElement('a');
        link.href = canvas.toDataURL("image/jpeg", 1.0);
        link.download = `${currentResult.name}_Result.jpg`;
        link.click();
    } finally {
        btn.disabled = false;
    }
});
