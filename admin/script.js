// ==========================================
// ⚙️ CONFIGURATION
// ==========================================
const API_URL = "https://script.google.com/macros/s/AKfycbxBljSkZbUb5kKliIQhWk7pvbsRg09IvHiSqg8g0ajxdmSixTTqceZzTe-BM5GWgXh_ow/exec";
let sessionPass = "";

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("loginBtn").addEventListener("click", login);
    const refreshBtn = document.getElementById("refreshBtn");
    if(refreshBtn) refreshBtn.addEventListener("click", () => loadAllData());
});

function login() {
    const input = document.getElementById("adminPass").value.trim();
    if(!input) { alert("Enter password"); return; }
    sessionPass = input;
    document.getElementById("loginBtn").innerText = "Verifying Command Center...";
    loadAllData(true); 
}

async function loadAllData(isLoginAttempt = false) {
    try {
        // FIXED: Added backticks for Template Literal
        const response = await fetch(`${API_URL}?action=readAll&password=${sessionPass}`);
        const data = await response.json();

        if (data.status === "success") {
            if(isLoginAttempt) {
                document.getElementById("loginScreen").style.display = "none";
                document.getElementById("dashboard").style.display = "block";
            }
            renderUserTasks(data.leads);
            renderPromoterPayouts(data.wallets);
        } else {
            throw new Error("Invalid Access");
        }
    } catch (err) {
        console.error(err);
        if(isLoginAttempt) alert("❌ Access Denied: Check Password");
    }
}

// ==========================================
// 3. RENDER PROMOTERS (₹100+ SEPARATE SECTION)
// ==========================================
function renderPromoterPayouts(wallets) {
    const container = document.getElementById("promoterList");
    container.innerHTML = "";
    const highEarners = wallets.filter(p => parseInt(p.walletBalance) >= 100);

    if (highEarners.length === 0) {
        container.innerHTML = "<p style='color:#555;'>No promoters due for payout (Min ₹100).</p>";
        return;
    }

    highEarners.forEach(promoter => {
        const card = `
            <div class="payout-card">
                <div class="card-info">
                    <span class="badge">Promoter</span>
                    <h4>${promoter.name}</h4>
                    <p class="upi-text">${promoter.upiId}</p>
                    <h2 class="amount">₹${promoter.walletBalance}</h2>
                </div>
                <button class="pay-btn" onclick="processPayout('${promoter.upiId}', '${promoter.walletBalance}', '${promoter.name}')">
                    Direct Pay (PhonePe) 💸
                </button>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', card);
    });
}

// ==========================================
// 4. RENDER NORMAL USERS (TASK TABLE)
// ==========================================
function renderUserTasks(leads) {
    const tbody = document.getElementById("userTaskBody");
    tbody.innerHTML = "";

    leads.reverse().forEach(row => {
        if(!row[1]) return; 

        const status = row[5] || "Pending";
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>
                <div style="font-weight:bold;">${row[3]}</div> <div style="font-size:11px; color:#555;">${row[2]}</div> </td>
            <td><b style="color:#22c55e">${row[4]}</b></td>
            <td><span class="status-badge ${status.toLowerCase()}">${status}</span></td>
            <td>
                <div class="action-group">
                    ${status !== "Approved" && status !== "Paid" ? 
                        `<button class="approve-sm" onclick="approveUser('${row[2]}', this)">Verify ✅</button>` : 
                        `<span class="done-check">✓ ${status}</span>`
                    }
                    <button class="pay-sm" onclick="processPayout('${row[3]}', '${row[6]}', 'User Task')">Pay ₹${row[6]}</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ==========================================
// 5. MISSING: APPROVE USER LOGIC
// ==========================================
window.approveUser = async function(phone, btn) {
    if(!confirm("Mark this task as Approved?")) return;
    btn.innerText = "...";
    btn.disabled = true;

    try {
        await fetch(API_URL, {
            method: "POST",
            mode: "no-cors",
            body: JSON.stringify({
                action: "approve",
                password: sessionPass,
                phone: phone
            })
        });
        alert("✅ Task Approved!");
        loadAllData(); // Refresh to show "Approved" status
    } catch (err) {
        alert("Error approving task");
        btn.disabled = false;
        btn.innerText = "Verify ✅";
    }
};

// ==========================================
// 6. SMART PAYOUT LOGIC
// ==========================================
function processPayout(upiId, amount, name) {
    if(!upiId || !upiId.includes('@')) {
        alert("Invalid UPI ID: " + upiId);
        return;
    }
    const cleanAmount = amount.toString().replace('₹', '').trim();
    // FIXED: Added backticks for Template Literal
    const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${cleanAmount}&cu=INR`;
    window.location.href = upiLink;
}
