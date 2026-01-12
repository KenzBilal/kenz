// ==========================================
// ⚙️ CONFIGURATION
// ==========================================
// ⚠️ PASTE YOUR DEPLOYED WEB APP URL HERE
const API_URL = "https://script.google.com/macros/s/AKfycbzA1tY3e3SXuZIGzPCu1J6LrB7hTMccdL03-Llz7tIan7B_GdcUUwNCCBsfTLXgym4KsQ/exec"; 

let sessionPass = ""; 

// ==========================================
// 1. EVENT LISTENERS (Wait for clicks)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("loginBtn").addEventListener("click", login);
    document.getElementById("refreshBtn").addEventListener("click", () => loadData());
});

// ==========================================
// 2. LOGIN LOGIC
// ==========================================
function login() {
  const input = document.getElementById("adminPass").value.trim();
  const btn = document.getElementById("loginBtn");

  if(!input) { alert("Enter password"); return; }
  
  btn.innerText = "Verifying...";
  btn.disabled = true;

  // Save input temporarily and try to fetch data
  sessionPass = input;
  loadData(true); 
}

// ==========================================
// 3. DATA LOADING
// ==========================================
function loadData(isLoginAttempt = false) {
  const tbody = document.getElementById("tableBody");
  
  if(!isLoginAttempt) {
    tbody.innerHTML = "<tr><td colspan='6' style='text-align:center; padding:20px;'>Refreshing Data...</td></tr>";
  }

  fetch(API_URL + "?action=read&password=" + sessionPass)
    .then(res => res.json())
    .then(data => {
      // If we get an Array (list of leads), the password is correct
      if (Array.isArray(data)) {
        if(isLoginAttempt) {
          document.getElementById("loginScreen").style.display = "none";
          document.getElementById("dashboard").style.display = "block";
        }
        renderTable(data);
        document.getElementById("lastUpdate").innerText = "Last updated: " + new Date().toLocaleTimeString();
      } else {
        // If we get an error object
        throw new Error("Wrong Password");
      }
    })
    .catch(err => {
      console.error(err);
      if(isLoginAttempt) {
        alert("❌ Access Denied: Wrong Password or Server Error");
        document.getElementById("loginBtn").innerText = "Enter Dashboard";
        document.getElementById("loginBtn").disabled = false;
      }
    });
}

// ==========================================
// 4. RENDER TABLE
// ==========================================
function renderTable(data) {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  if(data.length === 0) {
    tbody.innerHTML = "<tr><td colspan='6' style='text-align:center;'>No leads found yet.</td></tr>";
    return;
  }

  // Reverse array to show newest leads first
  data.reverse().forEach(row => {
    // Basic check to skip empty rows
    if(!row[1]) return; 

    // MAPPING DATA FROM SHEET COLUMNS
    // 0:Date, 1:PromoterCode, 2:LeadPhone, 3:LeadUPI, 4:AppName, 5:Status
    const date = new Date(row[0]).toLocaleDateString();
    const promoter = row[1];
    const phone = row[2];
    const upi = row[3];
    const app = row[4];
    const status = row[5] || "Pending"; 

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${date}</td>
      <td style="font-weight:bold; color:#888;">${promoter}</td>
      <td>
        <div style="font-weight:bold;">${phone}</div>
        <div style="font-size:11px; color:#555;">${upi}</div>
      </td>
      <td style="color:var(--green)">${app}</td>
      <td><span class="status-badge ${status.toLowerCase()}">${status}</span></td>
      <td>
        ${status !== "Approved" ? 
          `<button class="action-btn btn-green" onclick="approveUser('${phone}', this)">Approve ✅</button>` : 
          `<span style="color:#444; font-size:12px; margin-right:10px;">Synced</span>`
        }
        <a href="upi://pay?pa=${upi}&pn=User&am=100&cu=INR" class="action-btn pay-btn">Pay 💸</a>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// ==========================================
// 5. APPROVE USER
// ==========================================
// We attach this to window so the HTML onclick can find it
window.approveUser = function(phone, btn) {
  if(!confirm("Mark this user as Approved?")) return;

  btn.innerText = "...";
  btn.disabled = true;

  fetch(API_URL, {
    method: "POST",
    mode: "no-cors", 
    body: JSON.stringify({
      action: "approve",
      password: sessionPass,
      phone: phone
    })
  }).then(() => {
    alert("✅ Lead Approved!");
    btn.parentElement.innerHTML = '<span class="status-badge approved">Approved</span>';
  }).catch(err => {
    alert("Error connecting to server");
    btn.disabled = false;
    btn.innerText = "Approve ✅";
  });
};
function processPayout(upiId, amount, name) {
    const cleanAmount = amount.replace('₹', '').trim();
    
    // UPI Deep Link Format
    // pa = UPI ID, pn = Recipient Name, am = Amount, cu = Currency
    const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${cleanAmount}&cu=INR`;
    
    // Redirect to PhonePe/UPI Apps
    window.location.href = upiLink;
}

// Example of how to render the Promoter Card
function renderPromoterCard(promoter) {
    // Only show if balance >= 100
    if (parseInt(promoter.walletBalance) < 100) return '';

    return `
        <div class="payout-card">
            <div class="card-info">
                <h4>${promoter.name}</h4>
                <p class="upi-text">${promoter.upiId}</p>
                <h2 class="amount">₹${promoter.walletBalance}</h2>
            </div>
            <button class="pay-btn" onclick="processPayout('${promoter.upiId}', '${promoter.walletBalance}', '${promoter.name}')">
                Pay via PhonePe 💸
            </button>
        </div>
    `;
}
