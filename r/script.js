(function () {
  const STORAGE_KEY = "cashttree_referral";
  const COOKIE_KEY = "cashttree_ref";

  // 1️⃣ Get referral code from URL: /r/CODE
  const pathParts = window.location.pathname.split("/");
  const referralCode = pathParts[pathParts.length - 1];

  // 2️⃣ Validate referral code (FIRSTNAME + 4 DIGITS)
  const isValidCode = /^[A-Z]{2,}[0-9]{4}$/.test(referralCode);

  // 3️⃣ Read offer parameter
  const params = new URLSearchParams(window.location.search);
  const offer = params.get("offer");

  // 4️⃣ Map offers to pages
  const offerRoutes = {
    motwal: "/motwal",
    qoneqt: "/qoneqt"
    // add more offers here later
  };

  // 5️⃣ Decide redirect URL
  const redirectURL = offerRoutes[offer] || "/";

  if (!isValidCode) {
    window.location.replace(redirectURL);
    return;
  }

  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (!existing) {
      localStorage.setItem(STORAGE_KEY, referralCode);
      setCookie(COOKIE_KEY, referralCode, 30);
    }
  } catch (e) {
    setCookie(COOKIE_KEY, referralCode, 30);
  }

  // Small delay for UX
  setTimeout(() => {
    window.location.replace(redirectURL);
  }, 800);

  function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie =
      name + "=" + value + "; expires=" + expires + "; path=/; SameSite=Lax";
  }
})();
