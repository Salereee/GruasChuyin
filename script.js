function initLanding() {
  const header = document.querySelector('.header');
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-links a');
  const floatingButtons = document.querySelector('.floating-buttons');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Estado visual del header, leido con rAF para no bloquear el scroll
  let scrollTicking = false;

  function setHeaderOnScroll() {
    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 12);
    }
    scrollTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      scrollTicking = true;
      requestAnimationFrame(setHeaderOnScroll);
    }
  }, { passive: true });

  setHeaderOnScroll();

  // Menu hamburguesa
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

    // Cerrar al hacer clic fuera o con Escape
    document.addEventListener('click', (event) => {
      if (!navMenu.classList.contains('open')) {
        return;
      }
      if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && navMenu.classList.contains('open')) {
        closeMenu();
        menuToggle.focus();
      }
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // El breakpoint debe coincidir con el de styles.css
  const desktopQuery = window.matchMedia('(min-width: 769px)');
  desktopQuery.addEventListener('change', (event) => {
    if (event.matches) {
      closeMenu();
    }
  });

  // Entrada inicial del hero y de los botones flotantes
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
      }, 260);
    }
  };

  runInitialAnimations();

  if (document.readyState !== 'complete') {
    window.addEventListener('load', runInitialAnimations, { once: true });
  }

  // Revelado al hacer scroll, con entrada escalonada por grupo
  const reveals = document.querySelectorAll('.reveal');

  document.querySelectorAll('.services-grid .card, .coverage-list li, .gallery-grid .gallery-item')
    .forEach((element, index) => {
      element.style.setProperty('--reveal-delay', `${(index % 6) * 80}ms`);
    });

  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((element) => element.classList.add('visible'));
  } else {
    const observer = new IntersectionObserver((entries, self) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          self.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach((element) => observer.observe(element));

    // Red de seguridad: nada debe quedar invisible si el observer no dispara
    setTimeout(() => {
      reveals.forEach((element) => element.classList.add('visible'));
    }, 1800);
  }

  // Seccion activa en el navbar
  const spyTargets = document.querySelectorAll('main section[id]');
  const spyLinks = new Map();

  document.querySelectorAll('.nav-links a[href^="#"]').forEach((link) => {
    spyLinks.set(link.getAttribute('href').slice(1), link);
  });

  if ('IntersectionObserver' in window && spyTargets.length && spyLinks.size) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const link = spyLinks.get(entry.target.id);
        if (link) {
          link.classList.toggle('is-active', entry.isIntersecting);
        }
      });
    }, {
      rootMargin: '-45% 0px -50% 0px'
    });

    spyTargets.forEach((section) => spy.observe(section));
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
