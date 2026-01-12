// ==========================================
// ⚙️ CONFIGURATION
// ==========================================
const API_URL = "https://script.google.com/macros/s/AKfycbzA1tY3e3SXuZIGzPCu1J6LrB7hTMccdL03-Llz7tIan7B_GdcUUwNCCBsfTLXgym4KsQ/exec"; 
let sessionPass = ""; 

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("loginBtn").addEventListener("click", login);
    // Add a refresh listener if you have the button
    const refreshBtn = document.getElementById("refreshBtn");
    if(refreshBtn) refreshBtn.addEventListener("click", () => loadAllData());
});

// ==========================================
// 2. LOGIN & DATA ORCHESTRATION
// ==========================================
function login() {
    const input = document.getElementById("adminPass").value.trim();
    if(!input) { alert("Enter password"); return; }
    
    sessionPass = input;
    document.getElementById("loginBtn").innerText = "Verifying Command Center...";
    loadAllData(true); 
}

async function loadAllData(isLoginAttempt = false) {
    try {
        // We fetch the data from the server
        const response = await fetch(`${API_URL}?action=readAll&password=${sessionPass}`);
        const data = await response.json();

        if (data.status === "success") {
            if(isLoginAttempt) {
                document.getElementById("loginScreen").style.display = "none";
                document.getElementById("dashboard").style.display = "block";
            }
            
            // Separate rendering for the two sections
            renderUserTasks(data.leads);      // From Master_DB or Leads sheet
            renderPromoterPayouts(data.wallets); // From Promoter_Wallet sheet
            
        } else {
            throw new Error("Invalid Access");
        }
    } catch (err) {
        console.error(err);
        if(isLoginAttempt) alert("❌ Access Denied");
    }
}

// ==========================================
// 3. RENDER PROMOTERS (₹100+ SEPARATE SECTION)
// ==========================================
function renderPromoterPayouts(wallets) {
    const container = document.getElementById("promoterList");
    container.innerHTML = "";

    // Filter promoters who have ₹100 or more
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
                <div style="font-weight:bold;">${row[3]}</div>
                <div style="font-size:11px; color:#555;">${row[2]}</div>
            </td>
            <td><b style="color:#22c55e">${row[4]}</b></td>
            <td><span class="status-badge ${status.toLowerCase()}">${status}</span></td>
            <td>
                <div class="action-group">
                    ${status !== "Approved" ? 
                        `<button class="approve-sm" onclick="approveUser('${row[2]}', this)">Verify ✅</button>` : 
                        `<span class="done-check">✓ Approved</span>`
                    }
                    <button class="pay-sm" onclick="processPayout('${row[3]}', '20', 'User Task')">Pay ₹20</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ==========================================
// 5. SMART PAYOUT LOGIC
// ==========================================
function processPayout(upiId, amount, name) {
    if(!upiId.includes('@')) {
        alert("Invalid UPI ID");
        return;
    }
    const cleanAmount = amount.toString().replace('₹', '').trim();
    // Professional UPI Deep Link
    const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${cleanAmount}&cu=INR`;
    window.location.href = upiLink;
}
