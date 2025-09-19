// ---------- Visit Tracker ----------
(function () {
  const key = "lastVisit";
  const visitEl = document.getElementById("visitMessage");
  const now = Date.now();
  const last = localStorage.getItem(key);

  if (!last) {
    visitEl.textContent = "Welcome! Let us know if you have any questions.";
  } else {
    const ms = now - Number(last);
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    if (days < 1) {
      visitEl.textContent = "Back so soon! Awesome!";
    } else if (days === 1) {
      visitEl.textContent = "You last visited 1 day ago.";
    } else {
      visitEl.textContent = `You last visited ${days} days ago.`;
    }
  }
  localStorage.setItem(key, String(now));
})();

// ---------- Build gallery from JSON ----------
async function loadDiscover() {
  try {
    const res = await fetch("data/discover.json");
    if (!res.ok) throw new Error("Could not load data/discover.json");
    const items = await res.json();
    const gallery = document.getElementById("gallery");

    items.forEach((it, idx) => {
      const card = document.createElement("article");
      card.className = `card card--${idx + 1}`;
      card.setAttribute("aria-labelledby", `title-${idx}`);

      card.innerHTML = `
        <h2 id="title-${idx}">${escapeHtml(it.title)}</h2>
        <figure>
          <img src="${escapeHtml(it.image)}" alt="${escapeHtml(it.title)} image" width="300" height="200">
        </figure>
        <address>${escapeHtml(it.address)}</address>
        <p>${escapeHtml(it.description)}</p>
        <button class="btn" aria-label="Learn more about ${escapeHtml(it.title)}">Learn more</button>
      `;

      gallery.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    document.getElementById("gallery").innerHTML =
      '<p class="error">Sorry — failed to load discover data.</p>';
  }
}

// small helper to avoid HTML injection
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

loadDiscover();
