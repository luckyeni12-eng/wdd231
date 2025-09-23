// main.js - shared behaviors
document.addEventListener('DOMContentLoaded', () => {
  // nav toggle for small screens
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primaryNav');
  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      primaryNav.classList.toggle('open');
    });
  }

  // update footer year and last modified if available
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const lastModifiedEl = document.getElementById('lastModified');
  if (lastModifiedEl) {
    try {
      const lm = new Date(document.lastModified);
      lastModifiedEl.textContent = lm.toLocaleString();
      lastModifiedEl.setAttribute('datetime', lm.toISOString());
    } catch (e) {
      // ignore
    }
  }
});
