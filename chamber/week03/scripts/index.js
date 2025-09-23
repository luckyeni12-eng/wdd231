document.addEventListener('DOMContentLoaded', () => {
  // ----------------- SPOTLIGHTS -----------------
  const spotlightContainer = document.getElementById('spotlightContainer');

  function pickSpotlights(members) {
    const candidates = members.filter(m => m.membershipLevel === 2 || m.membershipLevel === 3);
    if (candidates.length === 0) return [];
    for (let i = candidates.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }
    const count = Math.min(candidates.length, (Math.random() < 0.5 ? 2 : 3));
    return candidates.slice(0, count);
  }

  if (spotlightContainer) {
    fetch('members.json')
      .then(r => r.json())
      .then(members => {
        const spots = pickSpotlights(members);
        spotlightContainer.innerHTML = '';
        if (spots.length === 0) {
          spotlightContainer.innerHTML = '<p class="loading">No spotlight members available.</p>';
          return;
        }
        spots.forEach(m => {
          const el = document.createElement('article');
          el.className = 'spot-card';
          el.innerHTML = `
            <img class="logo" src="${m.logo || 'images/placeholder.png'}" alt="${m.name} logo" loading="lazy">
            <h3>${m.name}</h3>
            <p>${m.category} • ${m.address}</p>
            <p class="muted">${m.phone}</p>
            <div class="spot-actions">
              <a class="cta" href="${m.website}" target="_blank" rel="noopener">Visit</a>
              <span class="badge">${m.membershipLevel === 3 ? 'Gold' : 'Silver'}</span>
            </div>
          `;
          spotlightContainer.appendChild(el);
        });
      })
      .catch(err => {
        spotlightContainer.innerHTML = '<p class="loading">Could not load spotlights.</p>';
        console.error(err);
      });
  }

  // ----------------- WEATHER -----------------
  const OWM_API_KEY = "25a6c3a30d10acf7cb6a5758357bd427"; 
  const city = "Lagos";
  const weatherBox = document.getElementById('weatherBox');

  if (weatherBox) {
    if (!OWM_API_KEY) {
      weatherBox.innerHTML = `<p class="loading">Weather unavailable — add your OpenWeatherMap API key.</p>`;
      return;
    }

    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${OWM_API_KEY}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${OWM_API_KEY}`;

    weatherBox.innerHTML = `<p class="loading">Fetching weather for ${city}...</p>`;

    Promise.all([fetch(currentUrl), fetch(forecastUrl)])
      .then(async ([currRes, forecastRes]) => {
        if (!currRes.ok || !forecastRes.ok) throw new Error("Weather fetch failed");
        const currentData = await currRes.json();
        const forecastData = await forecastRes.json();

        const currTemp = Math.round(currentData.main.temp);
        const currDesc = currentData.weather[0].description;
        const icon = currentData.weather[0].icon;

        let html = `
          <div style="display:flex;align-items:center;gap:1rem;">
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${currDesc}">
            <div>
              <p><strong>${city}</strong></p>
              <p>${currTemp}°C — ${currDesc}</p>
            </div>
          </div>
          <h4 style="margin-top:1rem;">📅 3-Day Forecast</h4>
          <ul style="list-style:none;padding:0;margin:0;">
        `;

        const forecastList = forecastData.list.filter(item => item.dt_txt.includes("12:00:00"));
        forecastList.slice(0, 3).forEach(item => {
          const date = new Date(item.dt * 1000);
          const dayName = date.toLocaleDateString(undefined, { weekday: 'long' });
          const temp = Math.round(item.main.temp);
          const desc = item.weather[0].main;
          const icon = item.weather[0].icon;
          html += `
            <li style="margin:.3rem 0;display:flex;align-items:center;gap:.5rem;">
              <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${desc}">
              <span>${dayName}: ${temp}°C (${desc})</span>
            </li>`;
        });

        html += "</ul>";
        weatherBox.innerHTML = html;
      })
      .catch(err => {
        console.error(err);
        weatherBox.innerHTML = `<p class="loading">Unable to load weather data. Please try again later.</p>`;
      });
  }

  // ----------------- FOOTER YEAR -----------------
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});
