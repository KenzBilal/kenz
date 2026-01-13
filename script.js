/* =========================================
   1. SQL CONNECTION (ROOT)
   ========================================= */
const supabaseUrl = 'https://qzjvratinjirrcmgzjlx.supabase.co';
const supabaseKey = 'sb_publishable_AB7iUKxOU50vnoqllSfAnQ_Wdji8gEc';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================
     2. MOBILE NAVIGATION (THE FIX)
     ========================================= */
  const toggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  if (toggle && navLinks) {
    // Brute force click handler
    toggle.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      navLinks.classList.toggle("nav-open");
      
      // Accessibility update
      const isOpen = navLinks.classList.contains("nav-open");
      toggle.setAttribute("aria-expanded", isOpen);
      toggle.innerHTML = isOpen ? "✕" : "☰"; // Changes icon to X when open
    };

    // Close menu when clicking any link inside
    navLinks.addEventListener("click", (e) => {
      if (e.target.tagName === 'A') {
        navLinks.classList.remove("nav-open");
        toggle.innerHTML = "☰";
      }
    });

    // Close menu when clicking anywhere outside
    document.addEventListener("click", (e) => {
      if (!navLinks.contains(e.target) && !toggle.contains(e.target)) {
        if (navLinks.classList.contains("nav-open")) {
          navLinks.classList.remove("nav-open");
          toggle.innerHTML = "☰";
        }
      }
    });
  }

  /* =========================================
     3. FAQ ACCORDION (SMOOTH)
     ========================================= */
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(item => {
    const question = item.querySelector(".faq-question");
    if (question) {
      question.onclick = function() {
        const isActive = item.classList.contains("active");

        // Close all others
        faqItems.forEach(other => other.classList.remove("active"));

        // Toggle current
        if (!isActive) {
          item.classList.add("active");
        }
      };
    }
  });

  /* =========================================
     4. SMOOTH SCROLLING 
     ========================================= */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#" || targetId === "") return;

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
     5. SMART REDIRECT LOGIC
     ========================================= */
  const dashLink = document.getElementById("menuDashboardLink");
  const partnerId = localStorage.getItem("p_id");

  if (dashLink) {
    if (partnerId) {
      // If already logged in, go straight to dashboard
      dashLink.href = "dashboard/index.html";
    } else {
      // Otherwise, go to login page
      dashLink.href = "dashboard/login.html";
    }
  }

});
