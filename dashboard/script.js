(function () {
  const STORAGE_KEY = "cashttree_referral";
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code") || localStorage.getItem(STORAGE_KEY);

  if (!code) {
    alert("Referral code not found.");
    return;
  }

  localStorage.setItem(STORAGE_KEY, code);
  document.getElementById("refCode").innerText = code;

  // 🔥 ALL OFFERS DEFINED HERE (ADD MORE LATER)
  const offers = [
    {
      id: "motwal",
      name: "Motwal App",
      desc: "Install & complete steps to earn rewards"
    },
    {
      id: "qoneqt",
      name: "Qoneqt App",
      desc: "Signup & apply referral code to earn bonus"
    }
    // 👉 add more offers here later
  ];

  const container = document.getElementById("offersContainer");

  offers.forEach(offer => {
    const link = `https://cashttree.online/r/${code}?offer=${offer.id}`;

    const div = document.createElement("div");
    div.className = "offer";
    div.innerHTML = `
      <h3>${offer.name}</h3>
      <p>${offer.desc}</p>
      <div class="actions">
        <button class="share" onclick="window.open('${link}','_blank')">
          Open
        </button>
        <button class="copy" onclick="navigator.clipboard.writeText('${link}')">
          Copy Link
        </button>
      </div>
    `;
    container.appendChild(div);
  });
})();
