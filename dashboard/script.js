const supabaseUrl = 'https://qzjvratinjirrcmgzjlx.supabase.co';
const supabaseKey = 'sb_publishable_AB7iUKxOU50vnoqllSfAnQ_Wdji8gEc';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

const MIN_WITHDRAW_PARTNER = 100;
const MIN_WITHDRAW_USER = 50;

document.addEventListener("DOMContentLoaded", () => {
    // Determine if we are on login or index
    if (document.getElementById("loginBtn")) {
        document.getElementById("loginBtn").addEventListener("click", attemptLogin);
    } else {
        initDashboard();
    }
});

async function attemptLogin() {
    const code = document.getElementById("code").value.trim().toUpperCase();
    const pass = document.getElementById("pass").value.trim();
    if (!code || !pass) return alert("Enter credentials");

    const { data: user, error } = await supabase
        .from('promoters')
        .select('*')
        .eq('username', code)
        .eq('password', pass)
        .single();

    if (user) {
        localStorage.setItem("p_id", user.id);
        window.location.href = "index.html";
    } else {
        alert("Invalid Code or Password");
    }
}

async function initDashboard() {
    const pId = localStorage.getItem("p_id");
    if (!pId) return window.location.href = "login.html";

    // 1. Fetch User Data
    const { data: user } = await supabase.from('promoters').select('*').eq('id', pId).single();
    
    // 2. Fetch Team (Users referred by this person)
    const { data: team } = await supabase.from('promoters')
        .select('full_name, username, wallet_balance, phone')
        .eq('referred_by', user.username);

    // 3. Fetch Approved Leads for Total Earnings
    const { data: leads } = await supabase.from('leads')
        .select('campaigns(promoter_payout)')
        .eq('promoter_id', pId)
        .eq('status', 'approved');

    const totalEarned = leads ? leads.reduce((sum, l) => sum + (l.campaigns?.promoter_payout || 0), 0) : 0;
    
    updateUI(user, totalEarned);
    renderTeam(team);
    renderSQLOffers(user.username);
}

function updateUI(user, totalEarned) {
    document.getElementById("loader").style.display = "none";
    document.getElementById("mainContent").style.display = "block";
    document.getElementById("userName").innerText = "Hello, " + user.full_name;
    document.getElementById("userCode").innerText = user.username;
    document.getElementById("walletBal").innerText = "₹" + user.wallet_balance;
    document.getElementById("totalEarned").innerText = "₹" + totalEarned;

    const btn = document.getElementById("payoutBtn");
    
    // RULE: If they have a username/code, they are a Partner (100). 
    // If they are a direct user (short/no code), they are User (50).
    const limit = (user.username && user.username.length > 3) ? MIN_WITHDRAW_PARTNER : MIN_WITHDRAW_USER;
    
    if (user.wallet_balance >= limit) {
        btn.innerText = "Request Payout 💸";
        btn.className = "payout-btn active";
        btn.disabled = false;
        btn.onclick = () => window.open(`https://wa.me/919876543210?text=Payout_Code_${user.username}_Amt_${user.wallet_balance}`);
    } else {
        btn.innerText = `Reach ₹${limit} to Withdraw`;
    }
}

function renderTeam(team) {
    const container = document.getElementById("teamList");
    if (!team || team.length === 0) return;

    container.innerHTML = team.map(m => {
        // MASK PHONE: Shows last 4 digits only
        const masked = m.phone ? "*******" + m.phone.slice(-4) : "No Phone";
        return `
            <div class="team-card">
                <div>
                    <strong>${m.full_name}</strong><br>
                    <small style="color:#666">${masked}</small>
                </div>
                <span class="badge ${m.wallet_balance > 0 ? 'success' : ''}">
                    ${m.wallet_balance > 0 ? 'Active' : 'Pending'}
                </span>
            </div>
        `;
    }).join('');
}

async function renderSQLOffers(userCode) {
    const container = document.getElementById("offersContainer");
    const { data: campaigns } = await supabase.from('campaigns').select('*').eq('is_active', true);
    if (!campaigns) return;

    container.innerHTML = campaigns.map(offer => {
        const cleanLink = `${window.location.origin}/${offer.app_name.toLowerCase()}/index.html?ref=${userCode}`;
        return `
        <div class="offer-card">
            <h3>${offer.app_name}</h3>
            <span class="pay-badge">₹${offer.promoter_payout} / Refer</span>
            <div class="actions">
                <button class="share-btn" onclick="copyLink('${cleanLink}')">Copy Link 🔗</button>
            </div>
        </div>
      `}).join('');
}

function copyCode() {
    const code = document.getElementById("userCode").innerText;
    navigator.clipboard.writeText(code);
    showToast();
}

function showToast() {
    const t = document.getElementById("toast");
    t.className = "show";
    setTimeout(() => t.className = "", 3000);
}

function logout() {
    localStorage.removeItem("p_id");
    window.location.href = "login.html";
}
