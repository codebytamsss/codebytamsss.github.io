/**
 * Tamanna Gupta - Student Portfolio JavaScript
 * Handles:
 * 1. Mobile menu toggle & keyboard navigation
 * 2. Active nav link highlighting with IntersectionObserver
 * 3. Subtle ambient background grid & floating particle animation
 * 4. Back-to-top scroll button
 * 5. Interactive contact form validation with friendly feedback
 * 6. Dynamic current year in footer
 */

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. DYNAMIC FOOTER YEAR ---
  const yearElement = document.getElementById("current-year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // --- 2. HEADER SCROLL EFFECT ---
  const header = document.getElementById("header");
  const backToTopBtn = document.getElementById("back-to-top");

  const handleScroll = () => {
    const scrollPos = window.scrollY;

    // Sticky header shadow & background intensification
    if (header) {
      if (scrollPos > 40) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollPos > 320) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  // --- 3. MOBILE NAVIGATION MENU ---
  const navToggle = document.getElementById("nav-toggle");
  const primaryNav = document.getElementById("primary-nav");
  const navLinks = document.querySelectorAll(".nav-link");

  const toggleNav = (forceClose = false) => {
    if (!primaryNav || !navToggle) return;
    const isOpen = forceClose ? false : !primaryNav.classList.contains("open");
    primaryNav.classList.toggle("open", isOpen);
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  };

  if (navToggle) {
    navToggle.addEventListener("click", () => toggleNav());
  }

  // Close mobile nav when clicking any link
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      toggleNav(true);
    });
  });

  // Close mobile nav on Escape key press
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && primaryNav && primaryNav.classList.contains("open")) {
      toggleNav(true);
      navToggle?.focus();
    }
  });

  // --- 4. ACTIVE NAVIGATION LINK ON SCROLL ---
  const sections = document.querySelectorAll("section[id]");

  if ("IntersectionObserver" in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -65% 0px",
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            const href = link.getAttribute("href");
            if (href === `#${id}`) {
              link.classList.add("active");
            } else {
              link.classList.remove("active");
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach((section) => sectionObserver.observe(section));
  }

  // --- 5. CONTACT FORM VALIDATION & FEEDBACK ---
  const contactForm = document.getElementById("contact-form");
  const feedbackBox = document.getElementById("form-feedback");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const nameInput = document.getElementById("contact-name");
      const emailInput = document.getElementById("contact-email");
      const messageInput = document.getElementById("contact-message");

      let isValid = true;

      // Helper function to validate fields
      const validateField = (input, condition) => {
        const group = input?.closest(".form-group");
        if (!condition) {
          group?.classList.add("has-error");
          isValid = false;
        } else {
          group?.classList.remove("has-error");
        }
      };

      // Simple email regex pattern
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      validateField(nameInput, nameInput?.value.trim().length > 0);
      validateField(emailInput, emailPattern.test(emailInput?.value.trim() || ""));
      validateField(messageInput, messageInput?.value.trim().length > 0);

      if (isValid && feedbackBox) {
        const userName = nameInput.value.trim();
        feedbackBox.className = "form-feedback success";
        feedbackBox.innerHTML = `
          <strong>Thank you, ${escapeHtml(userName)}!</strong>
          <p style="margin-top: 6px; font-size: 0.85rem;">
            Your message has been captured. Since this is a student project demonstration, you can also reach out directly via LinkedIn or email!
          </p>
        `;

        contactForm.reset();

        // Auto clear after 8 seconds
        setTimeout(() => {
          feedbackBox.className = "form-feedback";
          feedbackBox.innerHTML = "";
        }, 8000);
      }
    });

    // Remove error class on user input
    contactForm.querySelectorAll("input, textarea").forEach((field) => {
      field.addEventListener("input", () => {
        field.closest(".form-group")?.classList.remove("has-error");
      });
    });
  }

  // Helper to prevent HTML injection in feedback
  function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  // --- 6. SUBTLE AMBIENT CANVAS BACKGROUND ---
  const canvas = document.getElementById("ambient-canvas");
  if (canvas) {
    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      return; // Do not animate canvas if user prefers reduced motion
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles = [];
    let animationFrameId = null;

    const resizeCanvas = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    const particleCount = Math.min(Math.floor(window.innerWidth / 35), 35);

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = Math.random() * 1.8 + 0.6;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.baseAlpha = Math.random() * 0.4 + 0.15;
        this.color = Math.random() > 0.5 ? "56, 189, 248" : "139, 92, 246"; // Electric Blue or Violet
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.baseAlpha})`;
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const drawGridLines = () => {
      const gridSize = 80;
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = "rgba(56, 189, 248, 0.035)";

      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    };

    const connectNearbyParticles = () => {
      const maxDistance = 110;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.18;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle grid
      drawGridLines();

      // Update and draw particles
      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      // Subtle interconnecting webs
      connectNearbyParticles();

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener("resize", () => {
      resizeCanvas();
    });

    resizeCanvas();
    render();

    // Pause when tab is inactive to save battery and GPU
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
      } else {
        render();
      }
    });
  }

  // Console message for evaluators and student reference
  console.log(
    "%c Tamanna Gupta | Portfolio Website %c\nBuilt with semantic HTML5, modern CSS3 & Vanilla JavaScript.\nAll placeholders marked for easy editing.",
    "background: #8b5cf6; color: #ffffff; padding: 4px 8px; border-radius: 4px; font-weight: bold;",
    "color: #38bdf8;"
  );
});
