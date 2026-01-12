// ==========================================
// 🚀 10/10 SQL MASTER SCRIPT (SUPABASE)
// ==========================================
const supabaseUrl = 'https://qzjvratinjirrcmgzjlx.supabase.co';
const supabaseKey = 'sb_publishable_AB7iUKxOU50vnoqllSfAnQ_Wdji8gEc';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

const MIN_WITHDRAW = 100;

// --- INITIALIZE ON PAGE LOAD ---
document.addEventListener("DOMContentLoaded", () => {
    // If we have a login button on the page, we are on the login page
    if (document.getElementById("loginBtn")) {
        document.getElementById("loginBtn").addEventListener("click", attemptLogin);
    } 
    // If we have a dashboard loader, we are on the dashboard
    else if (document.getElementById("loader")) {
        initDashboard();
    }
});

// ==========================================
// 1. LOGIN LOGIC
// ==========================================
async function attemptLogin() {
    const codeInput = document.getElementById("code").value.trim().toUpperCase();
    const passInput = document.getElementById("pass").value.trim();
    const btn = document.getElementById("loginBtn");

    if (!codeInput || !passInput) {
        alert("Please fill in all fields");
        return;
    }

    btn.innerText = "Verifying...";
    btn.disabled = true;

    try {
        const { data: user, error } = await supabase
            .from('promoters')
            .select('*')
            .eq('username', codeInput)
            .eq('password', passInput)
            .single();

        if (error || !user) {
            alert("Invalid Code or Password");
            btn.innerText = "Login to Dashboard";
            btn.disabled = false;
        } else {
            // SUCCESS: Save the ID for session
            localStorage.setItem("p_id", user.id);
            window.location.href = "index.html"; 
        }
    } catch (err) {
        alert("Connection Error. Check internet.");
        btn.disabled = false;
    }
}

// ==========================================
// 2. DASHBOARD MAIN LOGIC
// ==========================================
async function initDashboard() {
    const pId = localStorage.getItem("p_id");

    if (!pId) {
        window.location.href = "login.html";
        return;
    }

    try {
        // 1. Fetch Promoter Data
        const { data: user, error: uError } = await supabase
            .from('promoters')
            .select('*')
            .eq('id', pId)
            .single();

        if (uError || !user) throw new Error("User not found");

        // 2. Fetch All Leads to calculate total earned
        const { data: leads, error: lError } = await supabase
            .from('leads')
            .select('status')
            .eq('promoter_id', pId);

        // Update Screen
        updateUI(user.full_name, user.username, user.wallet_balance, user.wallet_balance);
        
        // 3. Render the Apps/Offers
        renderSQLOffers(user.username);

    } catch (err) {
        console.error(err);
        logout();
    }
}

// ==========================================
// 3. UI & OFFERS
// ==========================================
function updateUI(name, code, wallet, earned) {
    document.getElementById("loader").style.display = "none";
    document.getElementById("mainContent").style.display = "block";

    document.getElementById("userName").innerText = "Hello, " + name;
    document.getElementById("userCode").innerText = code;
    document.getElementById("walletBal").innerText = "₹" + wallet;
    document.getElementById("totalEarned").innerText = "₹" + earned;

    const btn = document.getElementById("payoutBtn");
    if (parseFloat(wallet) >= MIN_WITHDRAW) {
        btn.innerText = "Request Payout 💸";
        btn.disabled = false;
        btn.onclick = () => window.open(`https://wa.me/919876543210?text=PayoutRequest_Code_${code}`, "_blank");
    } else {
        btn.innerText = `Reach ₹${MIN_WITHDRAW} to Withdraw`;
        btn.disabled = true;
    }
}

async function renderSQLOffers(userCode) {
    const container = document.getElementById("offersContainer");
    
    const { data: campaigns, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('is_active', true);

    if (error) return;

    container.innerHTML = campaigns.map(offer => {
        // Generates link like: domain.com/motwal/index.html?ref=MUHA5812
        const cleanLink = `${window.location.origin}/${offer.app_name.toLowerCase()}/index.html?ref=${userCode}`;
        
        return `
        <div class="offer-card">
          <div class="offer-header">
            <div>
              <h3>${offer.app_name}</h3>
              <span class="pay-badge">₹${offer.promoter_payout} / Refer</span>
            </div>
          </div>
          <p>Instant payout on verification.</p>
          <div class="actions">
            <button class="share-btn" onclick="copyLink('${cleanLink}')">Copy Link 🔗</button>
            <button class="view-btn" onclick="window.open('${cleanLink}', '_blank')">Test Link</button>
          </div>
        </div>
      `}).join('');
}

// ==========================================
// 4. HELPERS
// ==========================================
function logout() {
    localStorage.removeItem("p_id");
    window.location.href = "login.html";
}

function copyLink(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert("Referral Link Copied! 🔗");
    });
}
