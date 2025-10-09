// scripts/gallery.js
import { getFavorites, saveFavorites } from './utils.js';

const DATA_PATH = 'data/attractions.json';

/**
 * Initializes gallery functionality across pages.
 * - Fetches data from local JSON
 * - Renders lists (featured on index, full list on attractions)
 * - Wire up search, filters, sort
 */
export async function initGallery() {
  const data = await fetchData();
  if (!data || !Array.isArray(data)) return;

  // populate featured on index (first 3)
  const featuredContainer = document.getElementById('featuredList');
  if (featuredContainer) {
    const featured = data.slice(0, 3);
    featuredContainer.innerHTML = featured.map(cardMarkup).join('');
    attachCardListeners(featuredContainer, data);
  }

  // full gallery page
  const gallery = document.getElementById('gallery');
  if (gallery) {
    // populate category filter
    populateCategoryFilter(data);

    // initial render
    renderGallery(data);

    // search and filter listeners
    const search = document.getElementById('search');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortSelect = document.getElementById('sortSelect');

    [search, categoryFilter, sortSelect].forEach(el => {
      if (!el) return;
      el.addEventListener('input', () => {
        const filtered = filterAndSort(data, {
          q: search.value,
          category: categoryFilter.value,
          sort: sortSelect.value
        });
        renderGallery(filtered);
      });
    });
  }
}

/* fetch local JSON with try...catch and proper error handling */
async function fetchData() {
  try {
    const resp = await fetch(DATA_PATH, {cache: 'no-cache'});
    if (!resp.ok) throw new Error(`Failed to load data (${resp.status})`);
    const json = await resp.json();
    return json;
  } catch (err) {
    console.error('Error loading attractions data:', err);
    // show a helpful message on the page
    const gallery = document.getElementById('gallery') || document.getElementById('featuredList');
    if (gallery) {
      gallery.innerHTML = `<div class="card"><p>Sorry, we couldn't load the data. Please try again later.</p></div>`;
    }
    return null;
  }
}

/* Markup for a card — uses template literal */
function cardMarkup(item) {
  return `
    <article class="card" data-id="${item.id}" tabindex="0" role="article" aria-labelledby="${item.id}-title">
      <img src="${item.image}" alt="${escapeHtml(item.name)} image" loading="lazy" width="600" height="400">
      <h3 id="${item.id}-title">${escapeHtml(item.name)}</h3>
      <p class="muted">${escapeHtml(item.location)} • ${escapeHtml(item.category)}</p>
      <p class="desc">${escapeHtml(item.description.substring(0,120))}…</p>
      <div class="card-actions">
        <button class="btn details-btn" data-id="${item.id}">Details</button>
        <button class="btn fav-btn" data-id="${item.id}" aria-pressed="false">❤ Favorite</button>
      </div>
    </article>
  `;
}

/* attach click handlers for cards in a container */
function attachCardListeners(container, allData) {
  container.querySelectorAll('.details-btn').forEach(btn => {
    btn.addEventListener('click', (e) => openDetail(e.currentTarget.dataset.id, allData));
  });

  container.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => toggleFavorite(e.currentTarget.dataset.id, e.currentTarget));
    // set state from localStorage
    const id = btn.dataset.id;
    const favs = getFavorites();
    if (favs.includes(id)) btn.setAttribute('aria-pressed', 'true');
  });

  // keyboard accessibility: open details on Enter when focusing card
  container.querySelectorAll('.card').forEach(card => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const id = card.getAttribute('data-id');
        openDetail(id, allData);
      }
    });
  });
}

/* open detail: dispatch a custom event so modal module can handle it */
function openDetail(id, allData) {
  const item = allData.find(x => x.id === id);
  if (!item) return;
  document.dispatchEvent(new CustomEvent('openDetail', { detail: item }));
}

/* favorites: toggle with localStorage helpers */
function toggleFavorite(id, btn) {
  const favs = new Set(getFavorites());
  if (favs.has(id)) {
    favs.delete(id);
    btn.setAttribute('aria-pressed', 'false');
  } else {
    favs.add(id);
    btn.setAttribute('aria-pressed', 'true');
  }
  saveFavorites(Array.from(favs));
}

/* populate category select from data using Set */
function populateCategoryFilter(data) {
  const select = document.getElementById('categoryFilter');
  if (!select) return;
  const cats = [...new Set(data.map(d => d.category))].sort();
  cats.forEach(c => {
    const opt = document.createElement('option'); opt.value = c; opt.textContent = c;
    select.appendChild(opt);
  });
}

/* filter + sort helper using array methods */
function filterAndSort(data, { q = '', category = '', sort = 'name' } = {}) {
  let result = data.slice();

  if (q) {
    const term = q.toLowerCase();
    result = result.filter(item => {
      return item.name.toLowerCase().includes(term) ||
             item.location.toLowerCase().includes(term) ||
             item.description.toLowerCase().includes(term);
    });
  }

  if (category) {
    result = result.filter(item => item.category === category);
  }

  if (sort === 'name') {
    result.sort((a,b) => a.name.localeCompare(b.name));
  } else if (sort === 'year') {
    // oldest first
    result.sort((a,b) => (a.year_established || 0) - (b.year_established || 0));
  }

  return result;
}

/* render gallery */
function renderGallery(data) {
  const gallery = document.getElementById('gallery');
  if (!gallery) return;
  // use map to create markup
  gallery.innerHTML = data.map(cardMarkup).join('');
  attachCardListeners(gallery, data);
}

/* basic html escaper for safety */
function escapeHtml(s='') {
  return String(s)
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'", '&#039;');
}