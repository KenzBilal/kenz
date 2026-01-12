// ==========================================
// 🚀 CONFIGURATION (FILLED AUTOMATICALLY)
// ==========================================
const GOOGLE_FORM = {
  // Your Form Link (Updated to /formResponse for submission)
  URL: "https://docs.google.com/forms/d/e/1FAIpQLSdOaB8Lmcou9ooP-Ow7Mr3C6SDHXYxkWZnhORmwnBJTEl7XDA/formResponse",
  
  // Your Exact Field IDs
  NAME_ID:  "entry.193780616",  
  PHONE_ID: "entry.670476284",
  EMAIL_ID: "entry.1606782933",
  UPI_ID:   "entry.1686758830",
  CODE_ID:  "entry.2044459466" // We send the generated BATMAN1234 here
};

document.getElementById("signupBtn").addEventListener("click", function() {
  const btn = document.getElementById("signupBtn");
  
  // 1. GET VALUES
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();
  const upi = document.getElementById("upi").value.trim();

  // 2. VALIDATION
  if (name.length < 2) { alert("Please enter your full name."); return; }
  if (!/^[0-9]{10}$/.test(phone)) { alert("Please enter a valid 10-digit mobile number."); return; }
  if (!email.includes("@")) { alert("Please enter a valid email."); return; }
  if (upi.length < 3 || !upi.includes("@")) { alert("Please enter a valid UPI ID."); return; }

 // 3. GENERATE PROMOTER CODE (First 4 of Name + Last 4 Phone)
const cleanName = name.split(" ")[0].replace(/[^a-zA-Z]/g, "").toUpperCase();
const last4 = phone.slice(-4);

// FIX: Use .substring(0, 4) to take only the first 4 letters
const generatedCode = cleanName.substring(0, 4) + last4; 

const generatedPass = last4;

  // 4. SEND TO GOOGLE SHEETS
  btn.innerText = "Creating Account...";
  btn.disabled = true;

  const formData = new FormData();
  formData.append(GOOGLE_FORM.NAME_ID, name);
  formData.append(GOOGLE_FORM.PHONE_ID, phone);
  formData.append(GOOGLE_FORM.EMAIL_ID, email);
  formData.append(GOOGLE_FORM.UPI_ID, upi);
  formData.append(GOOGLE_FORM.CODE_ID, generatedCode);

  fetch(GOOGLE_FORM.URL, {
    method: "POST",
    mode: "no-cors",
    body: formData
  }).then(() => {
    // 5. SUCCESS: SHOW POPUP
    showSuccess(generatedCode, generatedPass);
  }).catch((err) => {
    alert("Network Error. Please try again.");
    btn.disabled = false;
    btn.innerText = "Sign Up as Promoter";
  });
});

function showSuccess(code, pass) {
  const popup = document.getElementById("successPopup");
  document.getElementById("newCode").innerText = code;
  document.getElementById("newPass").innerText = pass;
  
  popup.style.display = "flex";

  // Redirect to Dashboard Login when clicked
  document.getElementById("loginRedirectBtn").onclick = function() {
    window.location.href = "../dashboard/login.html";
  };
}
