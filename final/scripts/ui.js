// ui.js
import { fetchPlants } from './data.js';

// keys for localStorage
const LS_FAV = 'ug-favorites';
const LS_THEME = 'ug-theme';

function slugify(s){ return String(s).toLowerCase().replace(/\s+/g,'-').replace(/[^\w-]+/g,''); }

// helper: create a lightweight SVG data URL for a plant (keeps repo image-free)
function plantSVGDataUrl(name, bg='#e8f5e9'){
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 260'>
    <rect width='100%' height='100%' fill='${bg}'/>
    <g transform='translate(20,40)' fill='#1b5e20' font-family='system-ui,Arial' font-size='28'>
      <text x='0' y='0'>${name}</text>
    </g>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

// modal management
export function openModal(plant){
  const root = document.getElementById('modal-root');
  root.innerHTML = '';
  root.setAttribute('aria-hidden','false');

  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.tabIndex = -1;

  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.setAttribute('role','dialog');
  modal.setAttribute('aria-modal','true');
  modal.setAttribute('aria-label', `${plant.name} details`);
  modal.innerHTML = `
    <header>
      <h2>${plant.name}</h2>
      <button class="btn close-modal" aria-label="Close">Close</button>
    </header>
    <div class="modal-body">
      <img src="${plantSVGDataUrl(plant.name)}" alt="${plant.name} photo" loading="lazy">
      <div class="details">
        <p><strong>Scientific:</strong> ${plant.scientific}</p>
        <p><strong>Light:</strong> ${plant.light}</p>
        <p><strong>Water:</strong> ${plant.water}</p>
        <p><strong>Origin:</strong> ${plant.origin}</p>
        <p>${plant.description}</p>
        <div style="margin-top:1rem">
          <button class="btn add-fav">Add to Favorites</button>
          <button class="btn alt close-modal">Close</button>
        </div>
      </div>
    </div>
  `;
  backdrop.appendChild(modal);
  root.appendChild(backdrop);

  // focus + trap basics
  modal.querySelector('.close-modal').focus();

  function close(){
    root.innerHTML = '';
    root.setAttribute('aria-hidden','true');
  }

  root.querySelectorAll('.close-modal').forEach(btn => btn.addEventListener('click', close));
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
  });

  modal.querySelector('.add-fav').addEventListener('click', ()=>{
    toggleFavorite(plant.id);
    alert(`${plant.name} added to favorites.`);
  });
}

// favorites in localStorage
export function loadFavorites(){ 
  try {
    const raw = localStorage.getItem(LS_FAV);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
export function saveFavorites(arr){ localStorage.setItem(LS_FAV, JSON.stringify(arr)); }
export function toggleFavorite(id){
  const fav = loadFavorites();
  const idx = fav.indexOf(id);
  if (idx === -1) fav.push(id); else fav.splice(idx,1);
  saveFavorites(fav);
  // optional: update UI badges
  document.querySelectorAll(`[data-id="${id}"] .fav-toggle`).forEach(btn=>{
    btn.textContent = fav.includes(id) ? '♥' : '♡';
  });
}

// render a plant card
function plantCardHtml(p){
  return `
    <article class="card" data-id="${p.id}">
      <img src="${plantSVGDataUrl(p.name)}" alt="${p.name}" loading="lazy" width="400" height="260">
      <h3>${p.name}</h3>
      <p class="muted">${p.scientific}</p>
      <p class="muted">${p.origin}</p>
      <div class="meta">
        <small>${p.light} • ${p.water}</small>
        <div>
          <button class="btn small view-details" data-id="${p.id}">Details</button>
          <button class="btn small fav-toggle" aria-label="toggle favorite">${loadFavorites().includes(p.id) ? '♥' : '♡'}</button>
        </div>
      </div>
    </article>
  `;
}

export async function initCatalog({targetSelector = '#catalog', featuredSelector = '#featured-grid'} = {}){
  let plants = [];
  try {
    plants = await fetchPlants();
  } catch (err) {
    const target = document.querySelector(targetSelector);
    if (target) target.innerHTML = `<p class="error">Could not load catalog. Try again later.</p>`;
    return;
  }

  // Render at least 15 items (we have 15)
  const target = document.querySelector(targetSelector);
  const featured = document.querySelector(featuredSelector);

  function renderList(list){
    if (!target) return;
    target.innerHTML = list.map(p => plantCardHtml(p)).join('');
    // attach event listeners
    target.querySelectorAll('.view-details').forEach(btn=>{
      btn.addEventListener('click', (e)=>{
        const id = e.currentTarget.dataset.id;
        const plant = plants.find(x=>x.id === id);
        if (plant) openModal(plant);
      });
    });
    target.querySelectorAll('.fav-toggle').forEach((btn, i)=>{
      btn.addEventListener('click', (e)=>{
        const id = e.currentTarget.closest('.card').dataset.id;
        toggleFavorite(id);
      });
    });
  }

  // initial render (all)
  renderList(plants);

  // set up search/filter/sort
  const search = document.getElementById('search');
  const filterLight = document.getElementById('filter-light');
  const sortBy = document.getElementById('sort-by');
  const clearBtn = document.getElementById('clear-filters');

  function applyFilters(){
    let result = plants.slice(); // copy
    // search
    const q = search ? search.value.trim().toLowerCase() : '';
    if (q) result = result.filter(p => (p.name + ' ' + p.origin + ' ' + p.scientific).toLowerCase().includes(q));
    // light filter
    const L = filterLight ? filterLight.value : '';
    if (L) result = result.filter(p => p.light === L);
    // sort
    if (sortBy){
      if (sortBy.value === 'price'){
        result.sort((a,b)=>a.price - b.price);
      } else {
        result.sort((a,b)=>a.name.localeCompare(b.name));
      }
    }
    renderList(result);
  }

  // event listeners
  [search, filterLight, sortBy].forEach(el => { if (el) el.addEventListener('input', applyFilters) });
  if (clearBtn) clearBtn.addEventListener('click', ()=>{
    if (search) search.value='';
    if (filterLight) filterLight.value='';
    if (sortBy) sortBy.value='name';
    applyFilters();
  });

  // featured: show first 6
  if (featured){
    const featuredItems = plants.slice(0,6);
    featured.innerHTML = featuredItems.map(p => `
      <article class="card">
        <img src="${plantSVGDataUrl(p.name,'#f1f8ec')}" alt="${p.name}" loading="lazy">
        <h3>${p.name}</h3>
        <p>${p.origin}</p>
        <div class="meta"><small>${p.light}</small><small>$${p.price.toFixed(2)}</small></div>
      </article>
    `).join('');
  }

  // return plants for external use if needed
  return plants;
}

// form display for contact-action page
export function showFormResultFromQuery(){
  const params = new URLSearchParams(location.search);
  const el = document.getElementById('form-result');
  if (!el) return;
  if (![...params.keys()].length){
    el.innerHTML = '<p>No form data submitted yet.</p>';
    return;
  }
  const entries = [];
  for (const [k,v] of params.entries()){
    entries.push(`<li><strong>${k}:</strong> ${escapeHtml(v)}</li>`);
  }
  el.innerHTML = `<h2>Submitted Data</h2><ul>${entries.join('')}</ul>`;
}
function escapeHtml(s){ return (''+s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

// basic nav toggles + theme
export function initShell(){
  document.querySelectorAll('[id^=nav-toggle]').forEach(btn=>{
    const controls = btn.getAttribute('aria-controls');
    const nav = document.getElementById(controls);
    btn.addEventListener('click', ()=>{
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      if (nav) nav.setAttribute('aria-hidden', String(expanded));
    });
  });

  // theme
  const themeToggle = document.getElementById('theme-toggle');
  const theme = localStorage.getItem(LS_THEME) || 'light';
  if (theme === 'dark') document.documentElement.setAttribute('data-theme','dark');
  if (themeToggle){
    themeToggle.addEventListener('click', ()=>{
      const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next === 'dark' ? 'dark' : '');
      localStorage.setItem(LS_THEME, next);
    });
  }

  // set years in footer
  document.querySelectorAll('#year,#year2,#year3,#year4').forEach(sp => { if (sp) sp.textContent = new Date().getFullYear(); });

  // small enhancement: keyboard close for modal root
  document.addEventListener('keydown', (e)=>{
    if (e.key === 'Escape'){
      const root = document.getElementById('modal-root');
      if (root) { root.innerHTML = ''; root.setAttribute('aria-hidden','true'); }
    }
  });
}