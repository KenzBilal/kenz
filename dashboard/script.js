/* =========================================
   1. SQL CONNECTION
   ========================================= */
const supabaseUrl = 'https://qzjvratinjirrcmgzjlx.supabase.co';
const supabaseKey = 'sb_publishable_AB7iUKxOU50vnoqllSfAnQ_Wdji8gEc';

// ✅ FIX 1: Renamed to 'supabaseClient' to stop the crash
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener("DOMContentLoaded", () => {

  // --- A. DETECT PAGE TYPE ---
  const loginBtn = document.getElementById("loginBtn");
  const partnerId = localStorage.getItem("p_id");

  // --- B. LOGIN PAGE LOGIC ---
  if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
      
      const codeInput = document.getElementById("code").value.trim();
      const passInput = document.getElementById("pass").value.trim();

      if (!codeInput || !passInput) {
        showToast("⚠️ Enter Code and Password");
        return;
      }

      loginBtn.innerHTML = "Verifying...";
      loginBtn.disabled = true;

      // ✅ FIX 2: Query the 'partners' table (which we actually created)
      const { data, error } = await supabaseClient
        .from('partners')
        .select('*')
        .eq('code', codeInput)
        .eq('password', passInput)
        .single();

      if (error || !data) {
        console.error("Login Error:", error);
        showToast("❌ Invalid Credentials");
        loginBtn.innerHTML = "Unlock Dashboard";
        loginBtn.disabled = false;
      } else {
        // SUCCESS
        localStorage.setItem("p_id", data.id);
        localStorage.setItem("p_code", data.code);
        
        loginBtn.innerHTML = "✅ Success!";
        setTimeout(() => {
          window.location.href = "index.html"; 
        }, 1000);
      }
    });
  } 
  
  // --- C. DASHBOARD PAGE LOGIC ---
  else {
    // If on dashboard but no ID, kick to login
    if (!partnerId) {
      window.location.href = "login.html";
      return;
    }
    
    // Load Data
    initDashboard(partnerId);
  }

});

/* =========================================
   DASHBOARD FUNCTIONS
   ========================================= */
async function initDashboard(id) {
    // 1. Fetch Partner Data
    const { data: user, error } = await supabaseClient
        .from('partners')
        .select('*')
        .eq('id', id)
        .single();

    if (user) {
        // Update Balance & Name
        // We use optional chaining (?) to avoid errors if elements are missing
        const balEl = document.getElementById("balanceDisplay");
        const nameEl = document.getElementById("partnerName");
        const codeEl = document.getElementById("userCode"); // If you have this ID
        
        if (balEl) balEl.innerText = "₹" + (user.balance || 0);
        if (nameEl) nameEl.innerText = user.code;
        if (codeEl) codeEl.innerText = user.code;

        // Hide Loader if it exists
        const loader = document.getElementById("loader");
        const content = document.getElementById("mainContent");
        if(loader) loader.style.display = "none";
        if(content) content.style.display = "block";
    }
}

/* =========================================
   HELPER FUNCTIONS (Toast, Copy, etc.)
   ========================================= */
function showToast(msg) {
    let t = document.getElementById("toast");
    if (!t) {
        t = document.createElement("div");
        t.id = "toast";
        document.body.appendChild(t);
    }
    t.innerText = msg;
    t.className = "show"; 
    setTimeout(() => t.className = "", 3000);
}

function logout() {
    localStorage.removeItem("p_id");
    localStorage.removeItem("p_code");
    window.location.href = "login.html";
}

// Mobile Menu Logic
const menuBtn = document.getElementById("navToggle"); // Ensure this ID matches your HTML
const navLinks = document.getElementById("navLinks");
if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("nav-open");
    });
}
