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

  // Generate referral code
  const cleanName = name.replace(/\s+/g, "").toUpperCase().slice(0, 4);
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const referralCode = cleanName + randomNum;

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
    OPTIONAL LATER:
    - Send name, phone, UPI, referralCode to backend / Google Form
  */
});

function closePopup(){
  document.getElementById("popup").style.display = "none";
}
