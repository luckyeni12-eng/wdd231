// scripts/utils.js

export function getFavorites() {
  try {
    const raw = localStorage.getItem('lh_favorites');
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('Could not read favorites', err);
    return [];
  }
}

export function saveFavorites(arr) {
  try {
    localStorage.setItem('lh_favorites', JSON.stringify(arr));
  } catch (err) {
    console.warn('Could not save favorites', err);
  }
}

/* set footer year(s) */
export function setYear() {
  const el = document.getElementById('year') || document.getElementById('yearFooter') || document.getElementById('yearFooter');
  const yearEls = document.querySelectorAll('#year, #yearFooter, #yearFooter');
  const y = new Date().getFullYear();
  yearEls.forEach(node => {
    node.textContent = y;
  });
}