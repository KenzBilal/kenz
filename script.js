/* =========================================
   1. SQL CONNECTION
   ========================================= */
const supabaseUrl = 'https://qzjvratinjirrcmgzjlx.supabase.co';
const supabaseKey = 'sb_publishable_AB7iUKxOU50vnoqllSfAnQ_Wdji8gEc';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================
     2. MOBILE NAVIGATION (MENU)
     ========================================= */
  const toggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  if (toggle && navLinks) {
    toggle.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      navLinks.classList.toggle("nav-open");
      const isOpen = navLinks.classList.contains("nav-open");
      toggle.innerHTML = isOpen ? "✕" : "☰"; 
    };

    document.addEventListener("click", (e) => {
      if (!navLinks.contains(e.target) && !toggle.contains(e.target)) {
        navLinks.classList.remove("nav-open");
        toggle.innerHTML = "☰";
      }
    });
  }

  /* =========================================
     3. FAQ ACCORDION SYSTEM
     ========================================= */
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(item => {
    const question = item.querySelector(".faq-question");
    if (question) {
      question.onclick = function() {
        const isActive = item.classList.contains("active");
        // Close all others
        faqItems.forEach(other => other.classList.remove("active"));
        // Open this one if it wasn't active
        if (!isActive) item.classList.add("active");
      };
    }
  });

  /* =========================================
     4. TELEGRAM CTA (MOBILE FLOATING BUTTON)
     ========================================= */
  const mobileCta = document.getElementById("mobileCta");
  const ctaClose = document.querySelector(".cta-close");

  if (ctaClose && mobileCta) {
    ctaClose.onclick = function() {
      mobileCta.style.display = "none";
      // Optional: Remember that user closed it for this session
      sessionStorage.setItem("ctaClosed", "true");
    };
  }
  
  // Re-hide if they already closed it
  if (sessionStorage.getItem("ctaClosed") === "true" && mobileCta) {
    mobileCta.style.display = "none";
  }

  /* =========================================
     5. REDIRECT LOGIC
     ========================================= */
  const dashLink = document.getElementById("menuDashboardLink");
  const partnerId = localStorage.getItem("p_id");
  if (dashLink && partnerId) {
    dashLink.href = "dashboard/index.html";
  }
});
