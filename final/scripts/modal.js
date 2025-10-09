// scripts/modal.js
/**
 * Accessible modal module.
 * Listens to custom 'openDetail' events dispatched from gallery.js
 * and shows modal content. Handles focus-trap basics and keyboard closing.
 */

export function initModal() {
  const modal = document.getElementById('detailModal');
  if (!modal) return;

  const closeBtn = document.getElementById('modalClose');
  const titleEl = document.getElementById('modalTitle');
  const imgEl = document.getElementById('modalImage');
  const bodyEl = document.getElementById('modalBody');
  const favToggle = document.getElementById('favToggle');

  let lastFocus = null;
  let currentItem = null;

  document.addEventListener('openDetail', e => {
    currentItem = e.detail;
    openModal();
  });

  function openModal() {
    if (!modal) return;
    lastFocus = document.activeElement;
    modal.setAttribute('aria-hidden', 'false');
    titleEl.textContent = currentItem.name;
    imgEl.src = currentItem.image;
    imgEl.alt = `${currentItem.name} image`;
    bodyEl.innerHTML = `
      <p><strong>Location:</strong> ${escapeHtml(currentItem.location)}</p>
      <p><strong>Category:</strong> ${escapeHtml(currentItem.category)}</p>
      <p><strong>Year:</strong> ${escapeHtml(currentItem.year_established)}</p>
      <p>${escapeHtml(currentItem.description)}</p>
    `;

    // favorites toggle text
    const favs = getFavs();
    favToggle.textContent = favs.includes(currentItem.id) ? 'Remove Favorite' : 'Add to Favorites';
    favToggle.setAttribute('aria-pressed', String(favs.includes(currentItem.id)));
    favToggle.onclick = () => {
      toggleFav(currentItem.id);
      const nowFavs = getFavs();
      favToggle.textContent = nowFavs.includes(currentItem.id) ? 'Remove Favorite' : 'Add to Favorites';
      favToggle.setAttribute('aria-pressed', String(nowFavs.includes(currentItem.id)));
    };

    // show modal and focus close button
    modal.style.display = 'flex';
    closeBtn.focus();

    // trap simple keyboard behavior
    document.addEventListener('keydown', onKeyDown);
    // backdrop click to close
    modal.querySelector('[data-backdrop]').addEventListener('click', closeModal);
  }

  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    modal.style.display = 'none';
    document.removeEventListener('keydown', onKeyDown);
    if (lastFocus) lastFocus.focus();
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') closeModal();
    // simple tab trap
    if (e.key === 'Tab') {
      const focusable = modal.querySelectorAll('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])');
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  closeBtn.addEventListener('click', closeModal);

  // favorites helpers using localStorage
  function getFavs() {
    const raw = localStorage.getItem('lh_favorites');
    return raw ? JSON.parse(raw) : [];
  }
  function toggleFav(id) {
    const arr = getFavs();
    const idx = arr.indexOf(id);
    if (idx >= 0) arr.splice(idx,1);
    else arr.push(id);
    localStorage.setItem('lh_favorites', JSON.stringify(arr));
    // also update any fav buttons on page
    document.querySelectorAll(`.fav-btn[data-id="${id}"]`).forEach(btn => {
      btn.setAttribute('aria-pressed', String(arr.includes(id)));
    });
  }
}

// tiny escaper copied for safety
function escapeHtml(s='') {
  return String(s)
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'", '&#039;');
}