document.addEventListener('DOMContentLoaded', () => {
  const DATA_URL = 'data/discover.json';
  const grid = document.getElementById('placesGrid');
  const template = document.getElementById('placeTemplate');
  const visitMsg = document.getElementById('visitMessage');
  const visitText = document.getElementById('visitText');
  const closeVisit = document.getElementById('closeVisitMsg');

  // Load JSON and build cards
  fetch(DATA_URL)
    .then(res => {
      if (!res.ok) throw new Error('Could not fetch places data.');
      return res.json();
    })
    .then(items => {
      grid.innerHTML = '';
      items.forEach((item, idx) => {
        const clone = template.content.cloneNode(true);
        const article = clone.querySelector('.place-card');
        const areaName = item.id || `c${idx + 1}`;
        article.setAttribute('data-area', areaName); // ✅ NO INLINE STYLES

        clone.querySelector('.place-title').textContent = item.title;
        const img = clone.querySelector('img');
        img.src = item.image;
        img.alt = `${item.title} — image`;
        clone.querySelector('.place-address').textContent = item.address;
        clone.querySelector('.place-desc').textContent = item.description;

        const btn = clone.querySelector('.btn-learn');
        btn.addEventListener('click', () => {
          if (item.url) window.open(item.url, '_blank', 'noopener');
        });

        grid.appendChild(clone);
      });
    })
    .catch(err => {
      console.error(err);
      grid.innerHTML = '<p class="loading">Unable to load places right now.</p>';
    });

  // Visit message
  try {
    const KEY = 'discover_last_visit';
    const prev = localStorage.getItem(KEY);
    const now = Date.now();
    let message = '';

    if (!prev) {
      message = 'Welcome! Let us know if you have any questions.';
    } else {
      const diffDays = Math.floor((now - parseInt(prev, 10)) / (1000 * 60 * 60 * 24));
      if (diffDays < 1) message = 'Back so soon! Awesome!';
      else message = `You last visited ${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago.`;
    }

    localStorage.setItem(KEY, String(now));
    showVisitMsg(message);
  } catch (e) {
    console.warn('localStorage not available:', e);
  }

  function showVisitMsg(text) {
    if (!visitMsg || !visitText) return;
    visitText.textContent = text;
    visitMsg.hidden = false;
  }

  if (closeVisit) {
    closeVisit.addEventListener('click', () => {
      visitMsg.hidden = true;
    });
  }

  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && visitMsg && !visitMsg.hidden) {
      visitMsg.hidden = true;
    }
  });
});