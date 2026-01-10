document.addEventListener("DOMContentLoaded", function () {
  const submitBtn = document.querySelector(".submit-btn");

  if (!submitBtn) return;

  submitBtn.addEventListener("click", function () {
    const nameInput = document.getElementById("name");
    const phoneInput = document.getElementById("phone");

    const name = nameInput ? nameInput.value.trim() : "";
    const phone = phoneInput ? phoneInput.value.trim() : "";

    // Basic validation
    if (name.length < 2) {
      alert("Please enter your full name");
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }

    /* 
      OPTIONAL (LATER):
      Send name & phone to Google Form / backend here
      (Keeping it clean for now)
    */

    // Redirect to NORMAL referral link
    window.location.href =
      "https://trkkcoin.com/IT3779ZXP1/JAM0MN?ln=English";
  });
});
