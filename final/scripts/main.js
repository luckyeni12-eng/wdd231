// scripts/main.js
import { initGallery } from './gallery.js';
import { initModal } from './modal.js';
import { setYear } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  setYear();

  // Navigation toggle
  const navToggle = document.getElementById('navToggle');
  const siteNav = document.getElementById('siteNav');
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      siteNav.classList.toggle('open');
    });
  }

  // Initialize gallery and modal if present
  initGallery().catch(err => console.error('Gallery failed to initialize', err));
  initModal();

  // Handle the Join/Contact form
  const form = document.getElementById('joinForm');
  const result = document.getElementById('submissionResult');
  if (form && result) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      const data = new FormData(form);
      const entries = Array.from(data.entries());
      if (entries.length === 0) {
        result.innerHTML = '<p>Please fill out the form before submitting.</p>';
        return;
      }

      // Create a display list for the submitted data
      const dl = document.createElement('dl');
      entries.forEach(([k, v]) => {
        const dt = document.createElement('dt');
        dt.textContent = k.charAt(0).toUpperCase() + k.slice(1);
        const dd = document.createElement('dd');
        dd.textContent = v;
        dl.append(dt, dd);
      });

      result.innerHTML = '<h3>Submission Received</h3>';
      result.append(dl);

      form.reset();
      window.scrollTo({ top: result.offsetTop, behavior: 'smooth' });
    });
  }
});