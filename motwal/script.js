document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("submitBtn");

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

    // Redirect to NORMAL referral link
    window.location.href =
      "https://trkkcoin.com/IT3779ZXP1/JAM0MN?ln=English";
  });
});
