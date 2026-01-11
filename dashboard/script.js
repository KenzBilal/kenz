const CONFIG = {
  // ⚠️ PASTE YOUR CSV LINK HERE
  SHEET_URL: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQgMS1ev7ZwtWzDgwxBfmkaUcYku5O-uuJkBleP34pf5GXMgzWQMF8rOvIGdSyOtk4vgRHvMYuW7kvR/pub?gid=1787312793&single=true&output=csv",
  MIN_WITHDRAW: 100
};

// ==========================================
// 1. LOGIN LOGIC
// ==========================================
function attemptLogin() {
  const codeInput = document.getElementById("code").value.trim().toUpperCase();
  const passInput = document.getElementById("pass").value.trim();
  const btn = document.getElementById("loginBtn");
  const error = document.getElementById("errorMsg");

  if (!codeInput || !passInput) {
    error.innerText = "Please fill in all fields";
    return;
  }

  btn.innerText = "Verifying...";
  btn.disabled = true;

  fetch(CONFIG.SHEET_URL)
    .then(res => res.text())
    .then(csv => {
      const rows = parseCSV(csv);
      // SEARCH: Col B (Index 1) = Code | Col H (Index 7) = Password
      const user = rows.find(r => r[1] == codeInput && r[7] == passInput);

      if (user) {
        // SUCCESS: Save to LocalStorage
        localStorage.setItem("ct_user", JSON.stringify({
          name: user[0], // Col A
          code: user[1], // Col B
          wallet: user[6], // Col G
          earned: user[4]  // Col E
        }));
        window.location.href = "index.html";
      } else {
        error.innerText = "Invalid Code or Password";
        btn.innerText = "Login to Dashboard";
        btn.disabled = false;
      }
    })
    .catch(err => {
      error.innerText = "Connection Error. Try again.";
      btn.disabled = false;
    });
}

// ==========================================
// 2. DASHBOARD LOGIC
// ==========================================
function initDashboard() {
  const storedUser = localStorage.getItem("ct_user");

  // Security Check
  if (!storedUser) {
    window.location.href = "login.html";
    return;
  }

  const user = JSON.parse(storedUser);
  
  // 1. Refresh Data from Sheet (to get latest balance)
  fetch(CONFIG.SHEET_URL)
    .then(res => res.text())
    .then(csv => {
      const rows = parseCSV(csv);
      const freshUser = rows.find(r => r[1] === user.code);
      
      if(freshUser) {
        // Update the UI with fresh data
        updateUI(freshUser[0], freshUser[1], freshUser[6], freshUser[4]);
      }
    });

  renderOffers(user.code);
}

function updateUI(name, code, wallet, earned) {
  document.getElementById("loader").style.display = "none";
  document.getElementById("mainContent").style.display = "block";

  document.getElementById("userName").innerText = "Hello, " + name;
  document.getElementById("userCode").innerText = code;
  document.getElementById("walletBal").innerText = "₹" + wallet;
  document.getElementById("totalEarned").innerText = "₹" + earned;

  // Payout Button Logic
  const btn = document.getElementById("payoutBtn");
  const balance = parseFloat(wallet);
  
  if (balance >= CONFIG.MIN_WITHDRAW) {
    btn.innerText = "Request Payout 💸";
    btn.disabled = false;
    btn.classList.add("active");
    btn.onclick = () => window.open("https://wa.me/91YOUR_NUMBER?text=Request Payout Code: " + code, "_blank");
  } else {
    btn.innerText = `Reach ₹${CONFIG.MIN_WITHDRAW} to Withdraw`;
    btn.disabled = true;
  }
}

// ==========================================
// 3. OFFERS SYSTEM
// ==========================================
function renderOffers(code) {
  const container = document.getElementById("offersContainer");
  
  const campaigns = [
    {
      id: "motwal",
      name: "Motwal App",
      pay: "₹30 / Refer",
      desc: "Instant payout on verification.",
      // Points to your Motwal Page + User Code
      link: `../motwal/index.html?ref=${code}` 
    }
    // Add more offers here later (e.g., AngelOne)
  ];

  container.innerHTML = campaigns.map(offer => `
    <div class="offer-card">
      <div class="offer-header">
        <div>
          <h3>${offer.name}</h3>
          <span class="pay-badge">${offer.pay}</span>
        </div>
      </div>
      <p>${offer.desc}</p>
      <div class="actions">
        <button class="share-btn" onclick="copyLink('${window.location.origin}/${offer.link}')">
          Copy Link 🔗
        </button>
        <button class="view-btn" onclick="window.open('${offer.link}', '_blank')">
          Test Link
        </button>
      </div>
    </div>
  `).join('');
}

// Helpers
function logout() {
  localStorage.removeItem("ct_user");
  window.location.href = "login.html";
}

function parseCSV(text) {
  return text.split("\n").map(row => row.split(","));
}

function copyLink(text) {
  navigator.clipboard.writeText(text);
  alert("Link Copied!");
}
