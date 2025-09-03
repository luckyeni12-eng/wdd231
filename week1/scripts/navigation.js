// navigation.js — small-screen hamburger + large-screen hover with no twitch
const menuBtn = document.getElementById('menu-btn');
const siteNav = document.getElementById('site-nav');

function toggleMenu(){
  const open = siteNav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
}

// Protect against "twitch": only toggle on click, not hover
menuBtn?.addEventListener('click', toggleMenu);

// Close menu when a link is clicked (small screens)
siteNav?.addEventListener('click', (e) => {
  const a = e.target.closest('a');
  if (!a) return;
  if (window.matchMedia('(max-width: 767px)').matches) {
    siteNav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Open navigation');
  }
});
