const header = document.querySelector('.site-header');
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navAnchors = [...document.querySelectorAll('.nav-links a')];
const sections = [...document.querySelectorAll('main section[id]')];
const revealItems = document.querySelectorAll('.reveal');
const glow = document.querySelector('.cursor-glow');

// Sticky header state
const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 18);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

// Mobile navigation
if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    navLinks.classList.toggle('open', !open);
  });

  navAnchors.forEach((link) => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('open');
    });
  });
}

// Reveal content as it enters the viewport
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12 });

revealItems.forEach((item) => revealObserver.observe(item));

// Highlight the current section in the navigation
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navAnchors.forEach((link) => {
      const active = link.getAttribute('href') === `#${entry.target.id}`;
      link.classList.toggle('active', active);
    });
  });
}, { rootMargin: '-36% 0px -56% 0px', threshold: 0 });

sections.forEach((section) => sectionObserver.observe(section));

// Subtle mouse-following light on desktop
window.addEventListener('pointermove', (event) => {
  if (!glow || event.pointerType === 'touch') return;
  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;
});

// Gentle project-card perspective interaction
const tiltCards = document.querySelectorAll('[data-tilt]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion) {
  tiltCards.forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${y * -3}deg) rotateY(${x * 3}deg) translateY(-2px)`;
    });

    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}

document.getElementById('year').textContent = new Date().getFullYear();
