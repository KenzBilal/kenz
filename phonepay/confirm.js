function submitConfirm(e){
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if(name.length < 2){
    alert("Please enter a valid name");
    return;
  }

  if(phone.length !== 10){
    alert("Enter the 10-digit number used in PhonePe");
    return;
  }

 alert(
  "Details submitted successfully.\n\n" +
  "You will now be redirected to PhonePe to complete signup."
);

// 🔴 YOUR PHONEPE REFERRAL LINK
window.location.href = "https://phon.pe/30fjw1gh";

  // OPTIONAL: redirect to Telegram
  // window.location.href = "https://t.me/CashtTree_bot";
}
