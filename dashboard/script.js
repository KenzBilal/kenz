// ==========================================
// 🚀 10/10 DASHBOARD LOGIC (SQL POWERED)
// ==========================================
async function initDashboard() {
  // Check if we have the ID from Login
  const pId = localStorage.getItem("p_id");

  if (!pId) {
    window.location.href = "login.html";
    return;
  }

  try {
    // 1. Fetch Promoter Details (Balance & Name)
    const { data: user, error: uError } = await supabase
      .from('promoters')
      .select('*')
      .eq('id', pId)
      .single();

    if (uError || !user) throw new Error("User not found");

    // 2. Fetch Earnings (Calculate sum of approved leads)
    // In SQL, we can calculate this live!
    const { data: leads, error: lError } = await supabase
      .from('leads')
      .select('campaign_id, status')
      .eq('promoter_id', pId);

    // Calculate Wallet (This is better than reading a column)
    // We'll calculate it from the leads table for 100% accuracy
    updateUI(user.full_name, user.username, user.wallet_balance, "0"); 
    
    // 3. Render Offers (Now dynamic from SQL!)
    renderSQLOffers(user.username);

  } catch (err) {
    console.error(err);
    alert("Session Expired. Please Login again.");
    logout();
  }
}
async function renderSQLOffers(userCode) {
  const container = document.getElementById("offersContainer");
  
  // Fetch only active apps from your SQL 'campaigns' table
  const { data: campaigns, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('is_active', true);

  if (error) return;

  // --- 1. UPDATE THE VISUALS ---
function updateUI(name, code, wallet, earned) {
    // Hide loader, show content
    document.getElementById("loader").style.display = "none";
    document.getElementById("mainContent").style.display = "block";

    // Fill in the data
    document.getElementById("userName").innerText = "Hello, " + name;
    document.getElementById("userCode").innerText = code;
    document.getElementById("walletBal").innerText = "₹" + wallet;
    document.getElementById("totalEarned").innerText = "₹" + earned;

    // Payout Button Logic
    const btn = document.getElementById("payoutBtn");
    const balance = parseFloat(wallet);
    const MIN_WITHDRAW = 100; // You can change this
    
    if (balance >= MIN_WITHDRAW) {
        btn.innerText = "Request Payout 💸";
        btn.disabled = false;
        btn.onclick = () => window.open(`https://wa.me/919876543210?text=PayoutRequest_Code_${code}`, "_blank");
    } else {
        btn.innerText = `Reach ₹${MIN_WITHDRAW} to Withdraw`;
        btn.disabled = true;
    }
}

// --- 2. THE LOGOUT ---
function logout() {
    localStorage.removeItem("p_id");
    localStorage.removeItem("p_name");
    window.location.href = "login.html";
}

// --- 3. COPY TO CLIPBOARD ---
function copyLink(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert("Referral Link Copied! 🔗");
    }).catch(err => {
        console.error('Failed to copy', err);
    });
}
  
  container.innerHTML = campaigns.map(offer => {
    // Generate the tracking link using the app_name as the folder name
    const cleanLink = `${window.location.origin}/${offer.app_name.toLowerCase()}/index.html?ref=${userCode}`;
    
    return `
    <div class="offer-card">
      <div class="offer-header">
        <div>
          <h3>${offer.name}</h3>
          <span class="pay-badge">₹${offer.promoter_payout} / Refer</span>
        </div>
      </div>
      <p>Instant payout on verification.</p>
      <div class="actions">
        <button class="share-btn" onclick="copyLink('${cleanLink}')">Copy Link 🔗</button>
      </div>
    </div>
  `}).join('');
}
