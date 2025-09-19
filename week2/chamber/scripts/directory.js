/* Directory page logic:
   - Fetch members.json (async/await)
   - Render cards
   - Toggle grid/list view
*/

const container = document.getElementById('memberContainer');
const template = document.getElementById('memberCardTemplate');
const loadingMsg = document.getElementById('loadingMsg');
const emptyMsg = document.getElementById('emptyMsg');

const gridBtn = document.getElementById('gridBtn');
const listBtn = document.getElementById('listBtn');

// View toggle handlers
function setView(mode) {
  if (!container) return;
  if (mode === 'list') {
    container.classList.remove('grid');
    container.classList.add('list');
    gridBtn?.classList.remove('active');
    listBtn?.classList.add('active');
    gridBtn?.setAttribute('aria-pressed', 'false');
    listBtn?.setAttribute('aria-pressed', 'true');
  } else {
    container.classList.add('grid');
    container.classList.remove('list');
    gridBtn?.classList.add('active');
    listBtn?.classList.remove('active');
    gridBtn?.setAttribute('aria-pressed', 'true');
    listBtn?.setAttribute('aria-pressed', 'false');
  }
}

gridBtn?.addEventListener('click', () => setView('grid'));
listBtn?.addEventListener('click', () => setView('list'));

// Render a single member card
function renderMemberCard(member) {
  const node = template.content.cloneNode(true);
  const article = node.querySelector('article');
  const logo = node.querySelector('.card-logo');
  const title = node.querySelector('.card-title');
  const category = node.querySelector('.card-category');
  const address = node.querySelector('.card-address');
  const phone = node.querySelector('.card-phone');
  const link = node.querySelector('.card-link');
  const badge = node.querySelector('.badge');

  // Set membership level on the article for badge styling
  article.dataset.level = String(member.membershipLevel);

  // Fill content
  title.textContent = member.name;
  category.textContent = member.category || 'Local Business';
  address.textContent = member.address;
  phone.textContent = member.phone;
  link.href = member.website;
  link.setAttribute('aria-label', `Visit ${member.name} website`);

  // Badge label based on level
  const levels = { 1: 'Member', 2: 'Silver Member', 3: 'Gold Member' };
  badge.textContent = levels[member.membershipLevel] || 'Member';

  // Logo
  logo.src = member.logo;
  logo.alt = `${member.name} logo`;

  return node;
}

// Fetch & display members
async function loadMembers() {
  try {
    const res = await fetch('data/members.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const members = await res.json();

    // Sort: Gold (3) first, then Silver (2), then Member (1), then by name
    members.sort((a, b) => (b.membershipLevel - a.membershipLevel) || a.name.localeCompare(b.name));

    if (loadingMsg) loadingMsg.hidden = true;

    if (!Array.isArray(members) || members.length === 0) {
      if (emptyMsg) emptyMsg.hidden = false;
      return;
    }

    const frag = document.createDocumentFragment();
    for (const m of members) frag.appendChild(renderMemberCard(m));
    container.appendChild(frag);

    // default view: grid
    setView('grid');
  } catch (err) {
    console.error('Failed to load members:', err);
    if (loadingMsg) loadingMsg.textContent = 'Failed to load members. Please try again later.';
  }
}

loadMembers();
