document.addEventListener("DOMContentLoaded", () => {

  /* =========================================
     1. FAQ ACCORDION (Added this back)
     ========================================= */
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(item => {
    const question = item.querySelector(".faq-question");

    if (question) {
      question.addEventListener("click", () => {
        // Check if this item is currently open
        const isActive = item.classList.contains("active");

        // Close ALL other items first (so only one stays open)
        faqItems.forEach(otherItem => {
          otherItem.classList.remove("active");
        });

        // If the one we clicked wasn't open, open it now
        if (!isActive) {
          item.classList.add("active");
        }
      });
    }
  });

  /* =========================================
     2. MOBILE NAVIGATION
     ========================================= */
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("navLinks");

  if (toggle && nav) {
    // Open/Close menu
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      nav.classList.toggle("nav-open");
    });

    // Close menu when clicking a link (Fixes overlay getting stuck)
    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("nav-open");
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove("nav-open");
      }
    });
  }

  /* =========================================
     3. SMOOTH SCROLLING
     ========================================= */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });

  /* =========================================
     4. DASHBOARD LINK (Optional)
     ========================================= */
  const dashLink = document.getElementById("menuDashboardLink");
  const code = localStorage.getItem("cashttree_referral");
  if (code && dashLink) {
    dashLink.href = "/dashboard/?code=" + code;
  }
});
