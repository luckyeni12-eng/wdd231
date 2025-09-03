// date.js — dynamic © year and last modified
const copyrightEl = document.getElementById('copyright');
const lastModEl = document.getElementById('lastModified');

const year = new Date().getFullYear();
// Include copyright symbol and current year (requirement)
const name = 'Lucky Ayei Inyang Eni';
const country = 'Nigeria';
if (copyrightEl){
  copyrightEl.textContent = `© ${year} ${name} • ${country}`;
}

// document.lastModified is already a string; no manipulation required
if (lastModEl){
  lastModEl.textContent = `Last Modified: ${document.lastModified}`;
}
