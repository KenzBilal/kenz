document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("submitBtn");

  btn.addEventListener("click", function () {
    // 1. GET VALUES
    const phone = document.getElementById("phone").value.trim();
    const upi = document.getElementById("upi").value.trim();
    const msg = document.getElementById("statusMsg");

    // 2. VALIDATION
    if (!/^[0-9]{10}$/.test(phone)) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }
    if (upi.length < 5 || !upi.includes("@")) {
      alert("Please enter a valid UPI ID (e.g., user@oksbi)");
      return;
    }

    // 3. GET REFERRAL CODE FROM URL (e.g., ?ref=BATMAN)
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref') || "DIRECT_TRAFFIC";

    // 4. SHOW LOADING & DISABLE BUTTON
    btn.innerText = "Processing...";
    btn.disabled = true;
    btn.style.opacity = "0.7";

    // 5. PREPARE DATA FOR GOOGLE SHEETS
    // Using the IDs we extracted earlier
    const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSf-k2OWSAaqYKqxUWVzueKzg60Gd-Px6xzPP0gWBEvFZNRIqw/viewform?usp=publish-editor";
    const formData = new FormData();

    formData.append("entry.1820803299", upi);        // UPI ID
    formData.append("entry.1219897736", phone);      // Phone (Stored in 'App Name' column)
    formData.append("entry.1044400763", refCode);    // Promoter Code

    // 6. SEND SILENTLY & REDIRECT
    fetch(formUrl, {
      method: "POST",
      mode: "no-cors",
      body: formData
    }).then(() => {
      // Success Message
      msg.style.display = "block";
      btn.style.display = "none";

      // REDIRECT TO YOUR CREDITCODE LINK (1.5 seconds delay)
      setTimeout(() => {
        window.location.href = "https://trkkcoin.com/IT3779ZXP1/JAM0MN?ln=English";
      }, 1500);

    }).catch((error) => {
      // Even if error occurs, redirect so you don't lose the lead
      window.location.href = "https://trkkcoin.com/IT3779ZXP1/JAM0MN?ln=English";
    });
  });
});
