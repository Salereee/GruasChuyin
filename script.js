function initLanding() {
  // Menu hamburguesa y estado visual del header
  const header = document.querySelector('.header');
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-links a');
  const floatingButtons = document.querySelector('.floating-buttons');

  function setHeaderOnScroll() {
    if (!header) {
      return;
    }

    if (window.scrollY > 12) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  function closeMenu() {
    if (!navMenu || !menuToggle) {
      return;
    }

    navMenu.classList.remove('open');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      menuToggle.classList.toggle('open', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeMenu();
    }
  });

  window.addEventListener('scroll', setHeaderOnScroll, { passive: true });
  setHeaderOnScroll();

  // Entrada inicial de elementos del hero y botones flotantes
  let hasAnimated = false;
  const runInitialAnimations = () => {
    if (hasAnimated) {
      return;
    }
    hasAnimated = true;

    requestAnimationFrame(() => {
      document.body.classList.add('loaded');
    });

    if (floatingButtons) {
      setTimeout(() => {
        floatingButtons.classList.add('is-visible');
      }, 220);
    }
  };

  runInitialAnimations();

  if (document.readyState !== 'complete') {
    window.addEventListener('load', runInitialAnimations, { once: true });
  }

  // Animaciones suaves al hacer scroll con entrada escalonada
  const reveals = document.querySelectorAll('.reveal');

  const revealGroups = document.querySelectorAll('.services-grid .card, .coverage-cards article, .gallery-grid .gallery-item');
  revealGroups.forEach((element, index) => {
    const delay = (index % 6) * 90;
    element.style.setProperty('--reveal-delay', `${delay}ms`);
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -20px 0px'
      }
    );

    reveals.forEach((element) => observer.observe(element));

    // Fallback: evita elementos ocultos si el observer no dispara por algun edge case
    setTimeout(() => {
      reveals.forEach((element) => element.classList.add('visible'));
    }, 1600);
  } else {
    reveals.forEach((element) => element.classList.add('visible'));
  }

  // Año dinámico del footer
  const year = document.getElementById('year');
  if (year) {
    year.textContent = new Date().getFullYear();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLanding, { once: true });
} else {
  initLanding();
}
