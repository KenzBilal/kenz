document.getElementById("confirmForm").addEventListener("submit", function (e) {
  e.preventDefault(); // 🚨 STOPS PAGE REFRESH

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (name.length < 2) {
    alert("Please enter your name");
    return;
  }

  if (phone.length < 8) {
    alert("Please enter a valid phone number");
    return;
  }

  alert(
    "Details submitted successfully!\n\n" +
    "You will now be redirected to PhonePe to complete signup."
  );

  // ✅ PHONEPE REFERRAL LINK
  window.location.href = "https://phon.pe/30fjw1gh";
});

