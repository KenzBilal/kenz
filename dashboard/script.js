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
      // Search for the code in Column B (Index 1)
      const freshUser = rows.find(r => r[1] && r[1].trim() === user.code);
      
      if(freshUser) {
        // Found them! Update UI
        updateUI(freshUser[0], freshUser[1], freshUser[6], freshUser[4]);
      } else {
        // User not found in sheet (maybe deleted?)
        document.getElementById("loader").style.display = "none";
        alert("User not found in database. Please contact admin.");
        logout();
      }
    })
    .catch(err => {
      console.error(err);
      document.getElementById("loader").style.display = "none";
      alert("Failed to connect to spreadsheet. Check internet.");
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
    // ⚠️ UPDATE YOUR PHONE NUMBER BELOW
    btn.onclick = () => window.open("https://wa.me/919876543210?text=Request Payout Code: " + code, "_blank");
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
      link: `../motwal/index.html?ref=${code}` 
    },
    {
      id: "angelone",
      name: "Angel One",
      pay: "₹100 / Refer", 
      desc: "Open Free Account Only. No Trade Required.", 
      link: `../angelone/index.html?ref=${code}`
    }
  ];

  container.innerHTML = campaigns.map(offer => {
    // Fix link generation for copy button
    // Removes the ".." to make a clean shareable link
    const cleanLink = window.location.origin + offer.link.replace("..", "");
    
    return `
    <div class="offer-card">
      <div class="offer-header">
        <div>
          <h3>${offer.name}</h3>
          <span class="pay-badge">${offer.pay}</span>
        </div>
      </div>
      <p>${offer.desc}</p>
      <div class="actions">
        <button class="share-btn" onclick="copyLink('${cleanLink}')">
          Copy Link 🔗
        </button>
        <button class="view-btn" onclick="window.open('${offer.link}', '_blank')">
          Test Link
        </button>
      </div>
    </div>
  `}).join('');
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

// --- COPY TO CLIPBOARD FUNCTION ---
function copyCode() {
  const codeText = document.getElementById("userCode").innerText;
  
  // Ignore if code hasn't loaded yet
  if(codeText === "..." || codeText === "") return;

  navigator.clipboard.writeText(codeText).then(() => {
    // Show Toast
    const toast = document.getElementById("toast");
    toast.className = "show";
    
    // Hide after 2 seconds
    setTimeout(function(){ 
        toast.className = toast.className.replace("show", ""); 
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy', err);
  });
}
