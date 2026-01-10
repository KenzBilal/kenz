document.getElementById("leadForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const mobile = document.getElementById("mobile").value.trim();

  if (!name || !mobile) return;

  // Google Form POST URL
  const formUrl = "YOUR_GOOGLE_FORM_POST_URL";

  const data = new FormData();
  data.append("entry.NAME_ID", name);
  data.append("entry.MOBILE_ID", mobile);

  // silent submit
  fetch(formUrl, {
    method: "POST",
    mode: "no-cors",
    body: data
  });

  // smooth redirect
  setTimeout(() => {
    window.location.href = "YOUR_NORMAL_REFERRAL_LINK";
  }, 700);
});
