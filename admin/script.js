// ==========================================
// 🚀 SUPABASE CONFIGURATION
// ==========================================
const supabaseUrl = 'https://qzjvratinjirrcmgzjlx.supabase.co';
const supabaseKey = 'sb_publishable_AB7iUKxOU50vnoqllSfAnQ_Wdji8gEc';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

let MASTER_KEY = "BOSS777"; // Change this to your password

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("loginBtn").addEventListener("click", login);
    const refreshBtn = document.getElementById("refreshBtn");
    if(refreshBtn) refreshBtn.addEventListener("click", loadAllData);
});

function login() {
    const input = document.getElementById("adminPass").value.trim();
    if(input === MASTER_KEY) {
        document.getElementById("loginScreen").style.display = "none";
        document.getElementById("dashboard").style.display = "block";
        loadAllData();
    } else {
        alert("❌ Access Denied");
    }
}

async function loadAllData() {
    try {
        // 1. Fetch PENDING LEADS (For Tasks Table)
        const { data: leads, error: e1 } = await supabase
            .from('leads')
            .select('*, promoters(full_name, upi_id), campaigns(app_name, promoter_payout, user_payout)')
            .eq('status', 'pending');

        // 2. Fetch HIGH EARNING PROMOTERS (For Payout Cards)
        const { data: promoters, error: e2 } = await supabase
            .from('promoters')
            .select('*')
            .gt('wallet_balance', 99);

        if (e1 || e2) throw new Error("Database Error");

        renderUserTasks(leads);
        renderPromoterPayouts(promoters);
        
    } catch (err) {
        console.error(err);
        alert("Error loading data from SQL");
    }
}

// ==========================================
// 3. RENDER PROMOTER CARDS (Wallet Balance >= 100)
// ==========================================
function renderPromoterPayouts(promoters) {
    const container = document.getElementById("promoterList");
    container.innerHTML = promoters.length === 0 ? 
        "<p>No promoters due for payout.</p>" : "";

    promoters.forEach(p => {
        const card = `
            <div class="payout-card">
                <div class="card-info">
                    <span class="badge">Promoter</span>
                    <h4>${p.full_name}</h4>
                    <p class="upi-text">${p.upi_id}</p>
                    <h2 class="amount">₹${p.wallet_balance}</h2>
                </div>
                <button class="pay-btn" onclick="confirmPromoterPay('${p.id}', '${p.upi_id}', '${p.wallet_balance}', '${p.full_name}')">
                    Pay via PhonePe 💸
                </button>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', card);
    });
}

// ==========================================
// 4. RENDER NORMAL USERS (Task List)
// ==========================================
function renderUserTasks(leads) {
    const tbody = document.getElementById("userTaskBody");
    tbody.innerHTML = leads.length === 0 ? "<tr><td colspan='4'>No pending tasks.</td></tr>" : "";

    leads.forEach(lead => {
        const isPromoter = lead.promoter_id !== null;
        const upi = isPromoter ? lead.promoters.upi_id : lead.lead_upi;
        const payout = isPromoter ? lead.campaigns.promoter_payout : lead.campaigns.user_payout;
        const source = isPromoter ? lead.promoters.full_name : "Direct User";

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>
                <div style="font-weight:bold;">${lead.campaigns.app_name}</div>
                <div style="font-size:11px; color:#555;">By: ${source}</div>
            </td>
            <td><b style="color:#22c55e">${lead.lead_phone}</b></td>
            <td><code style="font-size:11px">${upi}</code></td>
            <td>
                <div class="action-group">
                    <button class="approve-sm" onclick="approveLead('${lead.id}', '${lead.promoter_id}', ${payout})">Approve ✅</button>
                    <button class="pay-sm" onclick="processPayout('${upi}', ${payout}, 'User Task')">Pay ₹${payout}</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ==========================================
// 5. ACTION LOGIC (SQL UPDATES)
// ==========================================
async function approveLead(leadId, promoterId, amount) {
    if(!confirm("Approve this task?")) return;
    
    // Update Lead to Approved
    await supabase.from('leads').update({ status: 'approved' }).eq('id', leadId);
    
    // If it's a promoter, add to their wallet balance
    if (promoterId !== "null" && promoterId !== null) {
        await supabase.rpc('increment_wallet', { row_id: promoterId, amount: amount });
    }
    
    alert("✅ Approved!");
    loadAllData();
}

async function confirmPromoterPay(pId, upi, amt, name) {
    processPayout(upi, amt, name);
    if(confirm("Once paid, reset promoter wallet to 0?")) {
        await supabase.rpc('process_payout', { p_id: pId });
        loadAllData();
    }
}

function processPayout(upiId, amount, name) {
    if(!upiId || !upiId.includes('@')) { alert("Invalid UPI ID"); return; }
    const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR`;
    window.location.href = upiLink;
}
