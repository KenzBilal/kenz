document.getElementById("createLinkBtn").addEventListener("click", () => {
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const upi = document.getElementById("upi").value.trim();

  if (name.length < 2) {
    alert("Enter valid name");
    return;
  }

  if (!/^[0-9]{10}$/.test(phone)) {
    alert("Enter valid 10-digit phone number");
    return;
  }

  if (!upi.includes("@")) {
    alert("Enter valid UPI ID");
    return;
  }

  // 🔥 NEW REFERRAL CODE LOGIC
  const firstName = name.split(" ")[0].toUpperCase();
  const last4 = phone.slice(-4);
  const referralCode = firstName + last4;

  const referralLink = `https://cashttree.online/r/${referralCode}`;

  // Show popup
  document.getElementById("refLink").innerText = referralLink;
  document.getElementById("popup").style.display = "flex";

  // Copy button
  document.getElementById("copyBtn").onclick = () => {
    navigator.clipboard.writeText(referralLink);
    document.getElementById("copyBtn").innerText = "Copied ✔";
  };

  /*
    NEXT STEP (LATER):
    Save name, phone, UPI, referralCode for approval
  */
});

function closePopup(){
  document.getElementById("popup").style.display = "none";
}
