document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("applyBtn");

  btn.addEventListener("click", function () {
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();

    if (name.length < 2) {
      alert("Please enter your full name");
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }

    /*
      NEXT STEP (LATER):
      - Send details to Google Form
      - Generate referral code
      - Show thank-you page
    */

    alert(
      "Thanks for applying!\n\nOur team will contact you soon with your referral link."
    );
  });
});
