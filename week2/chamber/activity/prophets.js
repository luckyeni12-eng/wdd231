const url = 'https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json';
const cards = document.querySelector('#cards');

// Fetch the data
async function getProphetData() {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch data");
    const data = await response.json();
    displayProphets(data.prophets);
  } catch (error) {
    console.error("Error fetching prophets:", error);
    cards.innerHTML = `<p style="color:red; text-align:center;">❌ Failed to load prophets data.</p>`;
  }
}

function displayProphets(prophets) {
  prophets.forEach((prophet) => {
    // Create card
    let card = document.createElement('section');

    // Name
    let fullName = document.createElement('h2');
    fullName.textContent = `${prophet.name} ${prophet.lastname}`;

    // Birth details
    let birthDate = document.createElement('p');
    birthDate.textContent = `Date of Birth: ${prophet.birthdate}`;

    let birthPlace = document.createElement('p');
    birthPlace.textContent = `Place of Birth: ${prophet.birthplace}`;

    // Portrait
    let portrait = document.createElement('img');
    portrait.setAttribute('src', prophet.imageurl);
    portrait.setAttribute('alt', `Portrait of ${prophet.name} ${prophet.lastname} - Prophet ${prophet.order}`);
    portrait.setAttribute('loading', 'lazy');

    // Assemble
    card.appendChild(fullName);
    card.appendChild(birthDate);
    card.appendChild(birthPlace);
    card.appendChild(portrait);

    cards.appendChild(card);
  });
}

// Run
getProphetData();
