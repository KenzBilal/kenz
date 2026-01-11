// ==========================================
// ⚙️ CONFIGURATION
// ==========================================
const CONFIG = {
  // ⚠️ PASTE YOUR ANGEL ONE LINK FROM CREDITCODE HERE
  OFFER_LINK: "https://trkkcoin.com/ITC65034934/JAM0MN?ln=English", 

  // AUTOMATIC SETTINGS (DO NOT CHANGE)
  APP_NAME: "AngelOne", // This will show in your Sheet
  
  // YOUR GOOGLE FORM CONFIG (Auto-filled)
  FORM_URL: "https://docs.google.com/forms/d/e/1FAIpQLSf-k2OWSAaqYKqxUWVzueKzg60Gd-Px6xzPP0gWBEvFZNRIqw/formResponse",
  FIELD_PHONE: "entry.1211951730", 
  FIELD_UPI:   "entry.1820803299",
  FIELD_APP:   "entry.1219897736", // Saves "AngelOne"
  FIELD_REF:   "entry.1044400763"  // Saves "BATMAN"
};

document.getElementById("submitBtn").addEventListener("click", function() {
    const btn = document.getElementById("submitBtn");
    const msg = document.getElementById("statusMsg");
    
    // 1. GET USER INPUT
    const phone = document.getElementById("phone").value.trim();
    const upi = document.getElementById("upi").value.trim();

    // 2. GET PROMOTER CODE FROM URL
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref') || "DIRECT"; 

    // 3. VALIDATION
    if (!/^[0-9]{10}$/.test(phone)) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }
    if (upi.length < 5 || !upi.includes("@")) {
      alert("Please enter a valid UPI ID");
      return;
    }

    // 4. LOCK BUTTON
    btn.innerText = "Processing...";
    btn.disabled = true;

    // 5. SEND DATA TO GOOGLE SHEETS
    const formData = new FormData();
    formData.append(CONFIG.FIELD_PHONE, phone);
    formData.append(CONFIG.FIELD_UPI, upi);
    formData.append(CONFIG.FIELD_APP, CONFIG.APP_NAME);
    formData.append(CONFIG.FIELD_REF, refCode);

    fetch(CONFIG.FORM_URL, {
      method: "POST",
      mode: "no-cors",
      body: formData
    }).then(() => {
      // 6. REDIRECT TO OFFER
      redirectToOffer();
    }).catch((err) => {
      // Fallback redirect
      redirectToOffer();
    });

    function redirectToOffer() {
      msg.style.display = "block";
      btn.style.display = "none";
      
      setTimeout(() => {
        window.location.href = CONFIG.OFFER_LINK;
      }, 1500);
    }
});
