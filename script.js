/* =============================================
   ZIRVE TAŞIMACILIK – script.js
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Navbar Scroll Effect ---- */
  const navbar = document.getElementById('mainNavbar');
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Navbar background on scroll
    if (scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll-to-top button visibility
    if (scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }

    // Active nav link highlighting
    highlightNavLink();
  });

  /* ---- Scroll To Top ---- */
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---- Active Nav Link ---- */
  function highlightNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const id = section.getAttribute('id');

      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  /* ---- Smooth scroll for nav links (close mobile menu) ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      // Close mobile navbar if open
      const navCollapse = document.getElementById('navMenu');
      if (navCollapse && navCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) bsCollapse.hide();
      }

      const offset = 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---- Counter Animation ---- */
  const statNumbers = document.querySelectorAll('.stat-number');

  const animateCounter = (el) => {
    const target = +el.getAttribute('data-target');
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current);
      }
    }, 16);
  };

  // Trigger counters when hero is visible
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statNumbers.forEach(animateCounter);
        heroObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) heroObserver.observe(heroStats);

  /* ---- Scroll-triggered Animations ---- */
  const animatedEls = document.querySelectorAll(
    '.service-card, .why-card, .gallery-item, .about-feature, .contact-info-item, .cta-box'
  );

  // Add initial state
  animatedEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, 80 * (Array.from(animatedEls).indexOf(entry.target) % 4));
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  animatedEls.forEach(el => revealObserver.observe(el));

  /* ---- Gallery Lightbox ---- */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const imageModal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImg');

  if (imageModal && modalImg) {
    const bsModal = new bootstrap.Modal(imageModal);

    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const imgSrc = item.querySelector('img').getAttribute('src');
        const imgAlt = item.querySelector('img').getAttribute('alt');
        modalImg.setAttribute('src', imgSrc);
        modalImg.setAttribute('alt', imgAlt);
        bsModal.show();
      });
    });
  }

  /* ---- Contact Form Submission ---- */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic validation
      const inputs = contactForm.querySelectorAll('[required]');
      let valid = true;

      inputs.forEach(input => {
        if (!input.value.trim()) {
          input.style.borderColor = '#e53e3e';
          valid = false;
        } else {
          input.style.borderColor = '#48bb78';
        }
      });

      if (!valid) return;

      // Simulate send
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Gönderiliyor...';
      submitBtn.disabled = true;

      setTimeout(() => {
        contactForm.style.display = 'none';
        formSuccess.classList.remove('d-none');
      }, 1500);
    });

    // Reset border on input
    contactForm.querySelectorAll('input, textarea, select').forEach(input => {
      input.addEventListener('input', () => {
        input.style.borderColor = '';
      });
    });
  }

  /* ---- Navbar close on outside click (mobile) ---- */
  document.addEventListener('click', (e) => {
    const navCollapse = document.getElementById('navMenu');
    if (!navCollapse) return;
    if (navCollapse.classList.contains('show') &&
        !navCollapse.contains(e.target) &&
        !document.querySelector('.navbar-toggler').contains(e.target)) {
      const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
      if (bsCollapse) bsCollapse.hide();
    }
  });

});
