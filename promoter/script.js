// ==========================================
// 🚀 SUPABASE CONFIGURATION (10/10 UPGRADE)
// ==========================================
const supabaseUrl = 'https://qzjvratinjirrcmgzjlx.supabase.co';
const supabaseKey = 'sb_publishable_AB7iUKxOU50vnoqllSfAnQ_Wdji8gEc';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

document.getElementById("signupBtn").addEventListener("click", async function() {
  const btn = document.getElementById("signupBtn");
  
  // 1. GET VALUES
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();
  const upi = document.getElementById("upi").value.trim();

  // 2. VALIDATION (Keep your original logic)
  if (name.length < 2) { alert("Please enter your full name."); return; }
  if (!/^[0-9]{10}$/.test(phone)) { alert("Please enter a valid 10-digit mobile number."); return; }
  if (!email.includes("@")) { alert("Please enter a valid email."); return; }
  if (upi.length < 3 || !upi.includes("@")) { alert("Please enter a valid UPI ID."); return; }

  // 3. GENERATE PROMOTER CODE (First 4 of Name + Last 4 Phone)
  const cleanName = name.split(" ")[0].replace(/[^a-zA-Z]/g, "").toUpperCase();
  const last4 = phone.slice(-4);
  const generatedCode = cleanName.substring(0, 4) + last4; 
  const generatedPass = last4;

  // 4. SEND TO SUPABASE SQL (The 10/10 Way)
  btn.innerText = "Creating Account...";
  btn.disabled = true;

  try {
    const { data, error } = await supabaseClient
      .from('promoters') // This MUST match your SQL table name
      .insert([
        { 
          full_name: name, 
          phone: phone, 
          username: generatedCode, 
          password: generatedPass, 
          upi_id: upi 
        }
      ]);

    if (error) {
      // HANDLE DUPLICATE ERRORS (e.g., phone already exists)
      if (error.code === '23505') {
        alert("This phone number is already registered!");
      } else {
        alert("Database Error: " + error.message);
      }
      btn.disabled = false;
      btn.innerText = "Sign Up as Promoter";
    } else {
      // 5. SUCCESS: SHOW POPUP
      showSuccess(generatedCode, generatedPass);
    }
  } catch (err) {
    alert("System Error. Check your internet connection.");
    btn.disabled = false;
    btn.innerText = "Sign Up as Promoter";
  }
});

// SUCCESS POPUP FUNCTION
function showSuccess(code, pass) {
  const popup = document.getElementById("successPopup");
  document.getElementById("newCode").innerText = code;
  document.getElementById("newPass").innerText = pass;
  popup.style.display = "flex";

  document.getElementById("loginRedirectBtn").onclick = function() {
    window.location.href = "../dashboard/login.html";
  };
}
