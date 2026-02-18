const DATA_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTJu-EDpFYXABL3Be-S-9QTqkWici-5xo9Pc9yS4BDlqulZW45ZK7WKLnWeYeWRk9bNrTD72hsLiOYF/pub?output=tsv";
const SUBJECTS = ["Quran", "Hifz", "Fiqh", "Thareeq", "Aqlakh", "Thajveed", "Lisan", "Aqeedha", "Thafseer", "Duroos"];

let allResults = [];
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

async function loadData() {
    try {
        const res = await fetch(DATA_URL);
        const txt = await res.text();
        const rows = txt.split("\n").map(r => r.split("\t")).slice(1);

        allResults = rows.map(r => {
            return {
                reg: r[0] ? r[0].trim() : "",
                class: r[1] ? r[1].trim() : "",
                name: r[2] ? r[2].trim() : "",
                subjects: SUBJECTS.map((s, i) => ({ name: s, mark: r[i + 3] ? r[i + 3].trim() : "" })),
                total: r[13] || "0"
            };
        });
    } catch (err) {
        console.error("Data loading failed", err);
    }
}

loadData();

document.getElementById("result-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const reg = document.getElementById("reg_no").value.trim().toUpperCase();
    const cls = document.getElementById("class_name").value.trim().toUpperCase();

    const found = allResults.find(x => x.reg.toUpperCase() === reg && x.class.toUpperCase() === cls);
    const box = document.getElementById("result-display");

    if (!found) {
        box.innerHTML = `<p class='error'>No Result Found</p>`;
        document.getElementById("pdf-btn").style.display = "none";
        return;
    }

    // --- മാറ്റങ്ങൾ ഇവിടെ തുടങ്ങുന്നു ---
    // റിസൾട്ട് കണ്ടുപിടിച്ചാൽ ഫോമും ഹെഡിംഗും ലോഗോയും മറയ്ക്കുന്നു
    document.getElementById("result-form").style.display = "none";
    document.querySelector("h1").style.display = "none";
    document.querySelector(".logo-wrap").style.display = "none";
    // --------------------------------

    currentResult = found;

    let totalMarksObtained = 0;
    let subjectCount = 0;
    let isFailed = false;

    let marksHTML = found.subjects
        .filter(s => s.mark !== "" && s.mark !== null) 
        .map(s => {
            const markVal = parseFloat(s.mark);
            const gradeData = getGrade(markVal);
            
            totalMarksObtained += markVal;
            subjectCount++;
            if(gradeData.s === "fail") isFailed = true;

            const statusColor = gradeData.s === "fail" ? "#dc3545" : "#28a745";
            return `
                <div class="mark-tile">
                    <span class="sub-name">${s.name}</span>
                    <div style="text-align: right;">
                        <span class="sub-score">${s.mark}</span>
                        <span style="font-size: 11px; font-weight: bold; margin-left: 5px; color: ${statusColor}">(${gradeData.g})</span>
                    </div>
                </div>
            `;
        }).join("");

    const averageMark = subjectCount > 0 ? (totalMarksObtained / subjectCount) : 0;
    const finalGradeData = getGrade(averageMark);
    
    const finalStatus = isFailed ? "FAILED" : "PASSED";
    const statusBg = isFailed ? "#dc3545" : "#28a745";

    box.innerHTML = `
        <div class="result-card" style="padding: 0; overflow: hidden; background: #fff; border: 1px solid #ddd; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            <div class="card-banner">
                <img src="header.png" alt="Madrasa Header" style="width: 100%; display: block;">
            </div>

            <div style="padding: 20px;">
                <div style="display: flex; justify-content: center; margin-bottom: 25px;">
                    <div style="background: #f0f4f8; border: 1.5px solid #0b3d91; padding: 8px 25px; border-radius: 50px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
                        <span style="color: #0b3d91; font-weight: 800; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; font-family: 'Inter', sans-serif;">
                            Annual Examination Result 2025-26
                        </span>
                    </div>
                </div>

                <div class="student-info-grid">
                    <div class="info-item"><b>STUDENT NAME</b><span>${found.name}</span></div>
                    <div class="info-item"><b>REG. NO</b><span>${found.reg}</span></div>
                    <div class="info-item"><b>CLASS</b><span>${found.class}</span></div>
                    <div class="info-item"><b>RESULT</b><span style="color: ${statusBg}; font-weight: 800;">${finalStatus}</span></div>
                </div>

                <div class="marks-container">
                    ${marksHTML}
                </div>

                <div class="total-grade-box">
                    <div class="stat-box bg-total">
                        <small>TOTAL MARKS</small>
                        <strong>${found.total}</strong>
                    </div>
                    <div class="stat-box" style="background: ${statusBg}">
                        <small>FINAL GRADE</small>
                        <strong>${finalGradeData.g}</strong>
                    </div>
                </div>
                
                <p style="text-align:center; font-size:10px; color:#666; margin-top:15px; border-top: 1px dashed #ccc; padding-top: 10px;">
                    <b>Result Status: ${finalStatus}</b><br>
                    Academic Year: 2025-2026 | D+ and above is Pass.
                </p>
            </div>
        </div>
        
        <button onclick="location.reload()" style="margin-top: 20px; background: none; border: 1px solid #ccc; color: #666; padding: 10px 20px; border-radius: 8px; cursor: pointer; width: 100%; font-weight: 600;">
            <i class="fa-solid fa-rotate-left"></i> Check Another Result
        </button>
    `;

    document.getElementById("pdf-btn").style.display = "block";
});

document.getElementById("pdf-btn").addEventListener("click", async function () {
    const btn = this;
    const originalText = btn.innerHTML;
    btn.classList.add('loading');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating Image...';
    btn.disabled = true;

    try {
        // ഡൗൺലോഡ് ചെയ്യുമ്പോൾ "Check Another" ബട്ടൺ ഫോട്ടോയിൽ വരാതിരിക്കാൻ അത് താൽക്കാലികമായി മറയ്ക്കുന്നു
        const checkAnotherBtn = document.querySelector("button[onclick='location.reload()']");
        if(checkAnotherBtn) checkAnotherBtn.style.visibility = "hidden";

        const box = document.getElementById("result-display");
        const canvas = await html2canvas(box, { 
            scale: 3, 
            useCORS: true, 
            backgroundColor: "#ffffff" 
        });
        
        if(checkAnotherBtn) checkAnotherBtn.style.visibility = "visible";

        const imgData = canvas.toDataURL("image/jpeg", 1.0);
        const link = document.createElement('a');
        let fileName = currentResult ? `${currentResult.name}_Result_2025-26.jpg` : "Annual_Result_2025-26.jpg";
        
        link.href = imgData;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
    } catch (error) {
        console.error(error);
        alert("Error generating Image.");
    } finally {
        btn.classList.remove('loading');
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
});