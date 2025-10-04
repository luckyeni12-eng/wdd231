/* discover.js
   Loads data/discover.json, builds the 8 cards, sets grid-area names (c1..c8),
   implements localStorage-based visit message (welcome / back so soon / n days ago).
*/

document.addEventListener('DOMContentLoaded', () => {
  const DATA_URL = 'data/discover.json';
  const grid = document.getElementById('placesGrid');
  const template = document.getElementById('placeTemplate');
  const visitMsg = document.getElementById('visitMessage');
  const visitText = document.getElementById('visitText');
  const closeVisit = document.getElementById('closeVisitMsg');

  // 1) Load JSON and build cards
  fetch(DATA_URL)
    .then(res => {
      if (!res.ok) throw new Error('Could not fetch places data.');
      return res.json();
    })
    .then(items => {
      grid.innerHTML = ''; // clear
      items.forEach((item, idx) => {
        const clone = template.content.cloneNode(true);
        const article = clone.querySelector('.place-card');
        // assign grid-area name (c1..c8) based on item id or index
        const areaName = item.id || `c${idx+1}`;
        article.style.gridArea = areaName;
        article.setAttribute('data-id', areaName);

        // fill content
        clone.querySelector('.place-title').textContent = item.title;
        const img = clone.querySelector('img');
        img.src = item.image; // image path from JSON
        img.alt = item.title + ' — image';
        // address tag
        clone.querySelector('.place-address').textContent = item.address;
        // description
        clone.querySelector('.place-desc').textContent = item.description;
        // learn more button -> open link in new tab
        const btn = clone.querySelector('.btn-learn');
        btn.addEventListener('click', () => {
          if (item.url) window.open(item.url, '_blank', 'noopener');
        });

        grid.appendChild(clone);
      });
      // after build: ensure each card has explicit grid-area name c1..c8 in DOM
      // (some older browsers require grid-area to match named areas in parent)
    })
    .catch(err => {
      console.error(err);
      grid.innerHTML = '<p class="loading">Unable to load places right now.</p>';
    });

  // 2) localStorage: last visit logic
  try {
    const KEY = 'discover_last_visit';
    const prev = localStorage.getItem(KEY);
    const now = Date.now();
    let message = '';
    if (!prev) {
      message = 'Welcome! Let us know if you have any questions.';
      showVisitMsg(message);
    } else {
      const prevMs = parseInt(prev, 10);
      if (isNaN(prevMs)) {
        // corrupt data -> reset
        message = 'Welcome! Let us know if you have any questions.';
        showVisitMsg(message);
      } else {
        const diffMs = now - prevMs;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (diffMs < (1000 * 60 * 60 * 24)) {
          // less than a day
          message = 'Back so soon! Awesome!';
          showVisitMsg(message);
        } else {
          message = `You last visited ${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago.`;
          showVisitMsg(message);
        }
      }
    }
    // store current date now (in ms)
    localStorage.setItem(KEY, String(now));
  } catch (e) {
    console.warn('localStorage not available:', e);
  }

  // visit message helper
  function showVisitMsg(text) {
    if (!visitMsg || !visitText) return;
    visitText.textContent = text;
    visitMsg.hidden = false;
  }

  // close button
  if (closeVisit) {
    closeVisit.addEventListener('click', () => {
      visitMsg.hidden = true;
    });
  }

  // Accessibility: allow ESC to close visit message
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && visitMsg && !visitMsg.hidden) {
      visitMsg.hidden = true;
    }
  });
});