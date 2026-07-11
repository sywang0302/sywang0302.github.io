(function initStarfield() {
  const canvas = document.getElementById('starfield');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];
  let frame;

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * ratio);
    canvas.height = Math.floor(window.innerHeight * ratio);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function createStars() {
    const count = Math.min(170, Math.floor(window.innerWidth / 7));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 1.25 + 0.2,
      speed: Math.random() * 0.16 + 0.025,
      alpha: Math.random() * 0.55 + 0.15,
      phase: Math.random() * Math.PI * 2
    }));
  }

  function draw(time = 0) {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    stars.forEach((star) => {
      const twinkle = reduceMotion ? 0.75 : Math.sin(time * 0.0015 + star.phase) * 0.2 + 0.75;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(202, 231, 242, ${star.alpha * twinkle})`;
      ctx.fill();
      if (!reduceMotion) {
        star.y -= star.speed;
        if (star.y < -3) { star.y = window.innerHeight + 3; star.x = Math.random() * window.innerWidth; }
      }
    });
    if (!reduceMotion) frame = requestAnimationFrame(draw);
  }

  function reset() {
    cancelAnimationFrame(frame);
    resize();
    createStars();
    draw();
  }
  window.addEventListener('resize', reset, { passive: true });
  reset();
})();

(function initNavigation() {
  const navbar = document.querySelector('.navbar');
  const links = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = document.querySelectorAll('main section[id]');
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-links');

  function closeMenu() {
    menu?.classList.remove('open');
    toggle?.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', 'Open menu');
  }

  toggle?.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });
  links.forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });

  function updateNavigation() {
    navbar?.classList.toggle('scrolled', window.scrollY > 30);
    let current = '';
    sections.forEach((section) => { if (window.scrollY >= section.offsetTop - 150) current = section.id; });
    links.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
  }
  window.addEventListener('scroll', updateNavigation, { passive: true });
  updateNavigation();
})();

(function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in');
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach((element) => element.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -35px' });
  elements.forEach((element) => observer.observe(element));
})();
