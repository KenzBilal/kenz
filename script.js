/* =========================================
   1. SQL CONNECTION (ROOT)
   ========================================= */
const supabaseUrl = 'https://qzjvratinjirrcmgzjlx.supabase.co';
const supabaseKey = 'sb_publishable_AB7iUKxOU50vnoqllSfAnQ_Wdji8gEc';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================
     2. MOBILE NAVIGATION (FIXED)
     ========================================= */
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("navLinks");

  if (toggle && nav) {
    // Open/Close menu when clicking ☰
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      nav.classList.toggle("nav-open");
      
      // Accessibility update
      const isOpen = nav.classList.contains("nav-open");
      toggle.setAttribute("aria-expanded", isOpen);
    });

    // Close menu when clicking a link (How it works / Dashboard)
    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("nav-open");
      });
    });

    // Close menu when clicking anywhere else on the screen
    document.addEventListener("click", (e) => {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove("nav-open");
      }
    });
  }

  /* =========================================
     3. FAQ ACCORDION
     ========================================= */
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(item => {
    const question = item.querySelector(".faq-question");

    if (question) {
      question.addEventListener("click", () => {
        const isActive = item.classList.contains("active");

        // Close all others
        faqItems.forEach(otherItem => {
          otherItem.classList.remove("active");
        });

        // Open current if it was closed
        if (!isActive) {
          item.classList.add("active");
        }
      });
    }
  });

  /* =========================================
     4. SMOOTH SCROLLING
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
     5. DYNAMIC DASHBOARD LINK
     ========================================= */
  const dashLink = document.getElementById("menuDashboardLink");
  const savedReferral = localStorage.getItem("cashttree_referral");
  const partnerId = localStorage.getItem("p_id");

  // If they are a logged-in partner, send them straight to dashboard index
  if (partnerId && dashLink) {
    dashLink.href = "dashboard/index.html";
  } 
  // Otherwise, if we have a referral code, attach it to login (optional)
  else if (savedReferral && dashLink) {
    dashLink.href = "dashboard/login.html?ref=" + savedReferral;
  }
  // Default fallback
  else if (dashLink) {
    dashLink.href = "dashboard/login.html";
  }

});


