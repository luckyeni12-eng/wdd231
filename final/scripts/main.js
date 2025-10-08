// main.js
import { initShell, initCatalog, showFormResultFromQuery } from './ui.js';

document.addEventListener('DOMContentLoaded', async () => {
  initShell();
  // If page has #catalog element, init catalog
  if (document.getElementById('catalog')) {
    await initCatalog();
  }
  // featured on index also uses same module
  if (document.getElementById('featured-grid')) {
    // initCatalog will populate featured if present
    await initCatalog({ targetSelector: '#catalog', featuredSelector: '#featured-grid' }).catch(()=>{});
  }
  // If contact-action page, show any submitted data
  if (document.getElementById('form-result')) {
    showFormResultFromQuery();
  }
});