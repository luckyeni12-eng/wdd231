// directory.js - loads members.json into directory.html
document.addEventListener('DOMContentLoaded', () => {
  const memberContainer = document.getElementById('memberContainer');
  const loadingMsg = document.getElementById('loadingMsg');
  const emptyMsg = document.getElementById('emptyMsg');
  const template = document.getElementById('memberCardTemplate');

  const gridBtn = document.getElementById('gridBtn');
  const listBtn = document.getElementById('listBtn');
  const cardsEl = memberContainer;

  function setView(view) {
    cardsEl.className = 'cards ' + (view === 'list' ? 'list' : 'grid');
    if (view === 'grid') {
      gridBtn.classList.add('active');
      gridBtn.setAttribute('aria-pressed', 'true');
      listBtn.classList.remove('active');
      listBtn.setAttribute('aria-pressed', 'false');
    } else {
      listBtn.classList.add('active');
      listBtn.setAttribute('aria-pressed', 'true');
      gridBtn.classList.remove('active');
      gridBtn.setAttribute('aria-pressed', 'false');
    }
  }

  if (gridBtn && listBtn) {
    gridBtn.addEventListener('click', () => setView('grid'));
    listBtn.addEventListener('click', () => setView('list'));
  }
  setView('grid');

  fetch('members.json')
    .then(r => {
      if (!r.ok) throw new Error('Could not fetch members.json');
      return r.json();
    })
    .then(data => {
      loadingMsg.hidden = true;
      if (!Array.isArray(data) || data.length === 0) {
        emptyMsg.hidden = false;
        return;
      }

      // populate all members
      data.forEach(member => {
        const clone = template.content.cloneNode(true);
        const article = clone.querySelector('article.card');
        article.dataset.level = member.membershipLevel || 1;
        const img = clone.querySelector('.card-logo');
        img.src = member.logo || 'images/placeholder.png';
        img.alt = `${member.name} logo`;
        clone.querySelector('.card-title').textContent = member.name;
        clone.querySelector('.card-category').textContent = member.category || '';
        clone.querySelector('.card-address').textContent = member.address || '';
        clone.querySelector('.card-phone').textContent = member.phone || '';
        const link = clone.querySelector('.card-link');
        link.href = member.website || '#';
        link.textContent = 'Visit Website';
        const badge = clone.querySelector('.badge');
        const levelName = (member.membershipLevel === 3) ? 'Gold Member' : (member.membershipLevel === 2 ? 'Silver Member' : 'Member');
        badge.textContent = levelName;
        memberContainer.appendChild(clone);
      });
    })
    .catch(err => {
      loadingMsg.hidden = true;
      emptyMsg.hidden = false;
      emptyMsg.textContent = 'Failed loading members.';
      console.error(err);
    });
});
