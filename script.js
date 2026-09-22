/* ============================================================
   TECH EFFORT – Home Remodeling Website
   script.js
============================================================ */

'use strict';

/* ------------------------------------------------------------
   Hamburger Menu
------------------------------------------------------------ */
(function initHamburger() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', function () {
    const isOpen = !mobileMenu.hidden;
    mobileMenu.hidden = isOpen;
    hamburger.setAttribute('aria-expanded', String(!isOpen));
    hamburger.classList.toggle('open', !isOpen);
  });

  // Close on link click
  mobileMenu.querySelectorAll('.mobile-link').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileMenu.hidden = true;
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.classList.remove('open');
    });
  });

  // Close when clicking outside
  document.addEventListener('click', function (e) {
    if (!mobileMenu.hidden &&
        !mobileMenu.contains(e.target) &&
        !hamburger.contains(e.target)) {
      mobileMenu.hidden = true;
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.classList.remove('open');
    }
  });
})();

/* ------------------------------------------------------------
   Sticky Header — add .scrolled class for stronger shadow
------------------------------------------------------------ */
(function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 12);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();

/* ------------------------------------------------------------
   Active Nav Highlight on Scroll
------------------------------------------------------------ */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.main-nav a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    },
    { rootMargin: '-35% 0px -60% 0px' }
  );

  sections.forEach(function (s) { io.observe(s); });
})();

/* ------------------------------------------------------------
   Scroll Reveal (staggered children)
------------------------------------------------------------ */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    elements.forEach(function (el) { el.classList.add('visible'); });
    return;
  }

  const io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        // Stagger siblings within the same parent grid/flex container
        const siblings = Array.from(
          entry.target.parentElement.querySelectorAll('.reveal')
        );
        const index = siblings.indexOf(entry.target);
        const delay  = Math.min(index * 75, 300);

        setTimeout(function () {
          entry.target.classList.add('visible');
        }, delay);

        io.unobserve(entry.target);
      });
    },
    { threshold: 0.10, rootMargin: '0px 0px -48px 0px' }
  );

  elements.forEach(function (el) { io.observe(el); });
})();

/* ------------------------------------------------------------
   Smooth Scroll for all anchor links
   (polyfills browsers without native CSS scroll-behavior)
------------------------------------------------------------ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();

      const headerH = (document.querySelector('.site-header') || { offsetHeight: 0 }).offsetHeight;
      const top     = target.getBoundingClientRect().top + window.scrollY - headerH;

      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
})();

/* ------------------------------------------------------------
   Map Pins – touch/click toggle for mobile
------------------------------------------------------------ */
(function initMapPins() {
  const pins = document.querySelectorAll('.map-pin');
  if (!pins.length) return;

  pins.forEach(function (pin) {
    // Toggle active class on click/tap (for touch devices)
    pin.addEventListener('click', function (e) {
      const isActive = pin.classList.contains('active');
      // Close all others
      pins.forEach(function (p) { p.classList.remove('active'); });
      if (!isActive) pin.classList.add('active');
      e.stopPropagation();
    });
  });

  // Close all pins when clicking outside the map
  document.addEventListener('click', function () {
    pins.forEach(function (p) { p.classList.remove('active'); });
  });
})();
