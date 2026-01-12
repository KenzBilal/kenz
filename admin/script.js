const supabaseUrl = 'https://qzjvratinjirrcmgzjlx.supabase.co';
const supabaseKey = 'sb_publishable_AB7iUKxOU50vnoqllSfAnQ_Wdji8gEc';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

const MASTER_KEY = "znek7906";

// 1. LOGIN LOGIC
document.getElementById("loginBtn").addEventListener("click", () => {
    const pass = document.getElementById("adminPass").value;
    if(pass === MASTER_KEY) {
        document.getElementById("authLayer").style.display = "none";
        document.getElementById("adminPanel").style.display = "block";
        loadData();
    } else {
        alert("Incorrect Password!");
    }
});

// 2. TAB SWITCHING
function switchTab(type) {
    document.getElementById("leadsSection").style.display = type === 'leads' ? 'block' : 'none';
    document.getElementById("payoutsSection").style.display = type === 'payouts' ? 'block' : 'none';
    document.getElementById("tabLeads").className = type === 'leads' ? 'tab active' : 'tab';
    document.getElementById("tabPayouts").className = type === 'payouts' ? 'tab active' : 'tab';
}

// 3. DATA LOADING (The Multi-Tasker)
async function loadData() {
    // --- PART A: LOAD PENDING LEADS ---
    const { data: leads, error: e1 } = await supabase
        .from('leads')
        .select('*, promoters(full_name, upi_id), campaigns(app_name, promoter_payout, user_payout)')
        .eq('status', 'pending');

    if (e1) console.error("Leads Error:", e1);

    document.getElementById("leadsList").innerHTML = (leads || []).map(l => {
        const isPromoter = l.promoter_id !== null;
        const amt = isPromoter ? l.campaigns.promoter_payout : l.campaigns.user_payout;
        const upi = isPromoter ? l.promoters?.upi_id : l.lead_upi;
        const source = isPromoter ? `PROMOTER: ${l.promoters?.full_name}` : `DIRECT USER`;

        return `
            <div class="card">
                <div>
                    <strong>${l.campaigns.app_name}</strong> | ${source}<br>
                    <small>User: ${l.lead_phone}</small><br>
                    <div style="margin-top:8px">
                        <span style="color:var(--primary)">₹${amt}</span> | <code class="upi-box">${upi || 'No UPI'}</code>
                    </div>
                </div>
                <div>
                    <button class="btn btn-pay" onclick="handlePayout('${l.id}', '${l.promoter_id}', ${amt}, '${upi}')">PAID ✅</button>
                    <button class="btn btn-reject" onclick="updateStatus('${l.id}', 'rejected')">REJECT</button>
                </div>
            </div>
        `;
    }).join('') || "No pending leads.";

    // --- PART B: LOAD PROMOTER WITHDRAWALS ---
    const { data: promoters, error: e2 } = await supabase
        .from('promoters')
        .select('*')
        .gt('wallet_balance', 99);

    if (e2) console.error("Promoter Error:", e2);

    document.getElementById("payoutsList").innerHTML = (promoters || []).map(p => `
        <div class="card">
            <div>
                <strong>${p.full_name}</strong><br>
                <code class="upi-box">${p.upi_id}</code>
            </div>
            <div style="text-align:right">
                <h2 style="margin:0; color:var(--primary)">₹${p.wallet_balance}</h2>
                <button class="btn btn-pay" onclick="clearPromoterWallet('${p.id}', '${p.upi_id}', ${p.wallet_balance}, '${p.full_name}')">MARK PAID 💸</button>
            </div>
        </div>
    `).join('') || "No one to pay yet.";
}

// 4. ACTION FUNCTIONS
async function handlePayout(leadId, promoterId, amount, upi) {
    window.location.href = `upi://pay?pa=${upi}&am=${amount}&cu=INR`;
    if(confirm("Confirm: Payment sent? This will approve the task.")) {
        await supabase.from('leads').update({ status: 'approved' }).eq('id', leadId);
        if (promoterId && promoterId !== "null") {
            await supabase.rpc('increment_wallet', { row_id: promoterId, amount: amount });
        }
        loadData();
    }
}

async function clearPromoterWallet(pId, upi, amt, name) {
    window.location.href = `upi://pay?pa=${upi}&pn=${encodeURIComponent(name)}&am=${amt}&cu=INR`;
    if(confirm("Did you send the money? This will reset their wallet to 0.")) {
        await supabase.rpc('process_payout', { p_id: pId });
        loadData();
    }
}

async function updateStatus(id, stat) {
    await supabase.from('leads').update({ status: stat }).eq('id', id);
    loadData();
}
