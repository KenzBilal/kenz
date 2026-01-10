(function () {
  const REDIRECT_URL = "/motwal"; // change later if needed
  const STORAGE_KEY = "cashttree_referral";
  const COOKIE_KEY = "cashttree_ref";

  // Extract referral code from URL (/r/CODE)
  const pathParts = window.location.pathname.split("/");
  const referralCode = pathParts[pathParts.length - 1];

  // Validate referral code (FIRSTNAME + 4 DIGITS)
  const isValidCode = /^[A-Z]{2,}[0-9]{4}$/.test(referralCode);

  if (!isValidCode) {
    console.warn("Invalid referral code:", referralCode);
    safeRedirect();
    return;
  }

  try {
    // Prevent overwrite if referral already exists
    const existing = localStorage.getItem(STORAGE_KEY);

    if (!existing) {
      localStorage.setItem(STORAGE_KEY, referralCode);
      setCookie(COOKIE_KEY, referralCode, 30);
    }
  } catch (e) {
    // Fallback to cookie only
    setCookie(COOKIE_KEY, referralCode, 30);
  }

  // Delay for UX (intentional)
  setTimeout(safeRedirect, 1200);

  function safeRedirect() {
    window.location.replace(REDIRECT_URL);
  }

  function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie =
      name + "=" + value + "; expires=" + expires + "; path=/; SameSite=Lax";
  }
})();
