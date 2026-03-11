document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const navLinks = document.querySelectorAll('.nav-list a[href^="#"]');
  const sections = document.querySelectorAll("main section[id]");
  const revealElements = document.querySelectorAll(
    ".about-card, .schedule-card, .video-card, .gallery-item, .social-card, .faq-item, .profile-wrapper, .lore-content, .cta-box"
  );
  const heroStats = document.querySelectorAll(".hero-stats strong");
  const heroImage = document.querySelector(".character-card");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const menuToggle = document.querySelector(".menu-toggle");
  const navbar = document.querySelector(".navbar");

  function openMenu() {
    if (!menuToggle || !navbar) return;
    menuToggle.classList.add("active");
    navbar.classList.add("open");
    menuToggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
  }

  function closeMenu() {
    if (!menuToggle || !navbar) return;
    menuToggle.classList.remove("active");
    navbar.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  }

  function toggleMenu() {
    if (!navbar || !menuToggle) return;

    const isOpen = navbar.classList.contains("open");
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", toggleMenu);
  }

  document.addEventListener("click", (event) => {
    if (!navbar || !menuToggle) return;
    if (window.innerWidth > 820) return;

    const clickedInsideNavbar = navbar.contains(event.target);
    const clickedMenuButton = menuToggle.contains(event.target);

    if (!clickedInsideNavbar && !clickedMenuButton) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 820) {
      closeMenu();
    }
  });

  function handleHeaderScroll() {
    if (!header) return;

    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  handleHeaderScroll();
  window.addEventListener("scroll", handleHeaderScroll);

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (!targetSection) return;

      event.preventDefault();

      const headerHeight = header ? header.offsetHeight : 0;
      const targetPosition =
        targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight + 1;

      window.scrollTo({
        top: targetPosition,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });

      if (window.innerWidth <= 820) {
        closeMenu();
      }
    });
  });

  function setActiveLink() {
    const scrollPosition = window.scrollY + (header ? header.offsetHeight + 120 : 120);

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        navLinks.forEach((link) => link.classList.remove("active"));

        const activeLink = document.querySelector(`.nav-list a[href="#${sectionId}"]`);
        if (activeLink) {
          activeLink.classList.add("active");
        }
      }
    });
  }

  setActiveLink();
  window.addEventListener("scroll", setActiveLink);

  if (!prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
      }
    );

    revealElements.forEach((element, index) => {
      element.style.transitionDelay = `${index * 40}ms`;
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("revealed");
    });
  }

  function animateCounter(element, endValue, duration = 1600, suffix = "") {
    let startValue = 0;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutCubic);

      element.textContent = `${currentValue}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = `${endValue}${suffix}`;
      }
    }

    requestAnimationFrame(updateCounter);
  }

  if (heroStats.length && !prefersReducedMotion) {
    const statsObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          heroStats.forEach((stat) => {
            const originalText = stat.textContent.trim();

            if (stat.dataset.animated === "true") return;

            const numericValue = parseInt(originalText.replace(/\D/g, ""), 10);
            const suffix = originalText.replace(/[0-9]/g, "");

            if (!isNaN(numericValue)) {
              animateCounter(stat, numericValue, 1400, suffix);
              stat.dataset.animated = "true";
            }
          });

          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.4,
      }
    );

    const statsContainer = document.querySelector(".hero-stats");
    if (statsContainer) {
      statsObserver.observe(statsContainer);
    }
  }

  if (heroImage && !prefersReducedMotion) {
    window.addEventListener("mousemove", (event) => {
      const x = (window.innerWidth / 2 - event.clientX) / 40;
      const y = (window.innerHeight / 2 - event.clientY) / 40;

      heroImage.style.transform = `translate(${x}px, ${y}px)`;
    });

    window.addEventListener("mouseleave", () => {
      heroImage.style.transform = "translate(0, 0)";
    });
  }

  const yearElement = document.querySelector("[data-year]");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});