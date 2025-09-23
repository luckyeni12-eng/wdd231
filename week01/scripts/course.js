// Course array
const courses = [
  {
    subject: 'CSE',
    number: 110,
    title: 'Introduction to Programming',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'This course will introduce students to programming...',
    technology: ['Python'],
    completed: true
  },
  {
    subject: 'WDD',
    number: 130,
    title: 'Web Fundamentals',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'This course introduces students to the World Wide Web...',
    technology: ['HTML', 'CSS'],
    completed: true
  },
  {
    subject: 'CSE',
    number: 111,
    title: 'Programming with Functions',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'Students become more organized, efficient programmers...',
    technology: ['Python'],
    completed: true
  },
  {
    subject: 'CSE',
    number: 210,
    title: 'Programming with Classes',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'This course introduces classes and objects...',
    technology: ['C#'],
    completed: true
  },
  {
    subject: 'WDD',
    number: 131,
    title: 'Dynamic Web Fundamentals',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'Students will learn to create dynamic websites...',
    technology: ['HTML', 'CSS', 'JavaScript'],
    completed: true
  },
  {
    subject: 'WDD',
    number: 231,
    title: 'Frontend Web Development I',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'Students will focus on UX, accessibility, performance...',
    technology: ['HTML', 'CSS', 'JavaScript'],
    completed: false
  }
];

const courseGrid = document.getElementById('courses');
const creditTotalEl = document.getElementById('credit-total');
const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));

function formatTitle(c) {
  return `${c.subject} ${c.number}: ${c.title}`;
}

function courseBadge(c) {
  const cls = c.subject === 'WDD' ? 'wdd' : 'cse';
  return `<span class="badge ${cls}" aria-label="${c.subject} course">${c.subject}</span>`;
}

function techTags(c) {
  return c.technology.map(t => `<span class="tag">${t}</span>`).join('');
}

function cardTemplate(c) {
  return `
    <article class="card ${c.completed ? 'completed' : ''}" aria-label="${formatTitle(c)}">
      <header>
        <h3>${formatTitle(c)}</h3>
        ${courseBadge(c)}
      </header>
      <div class="meta">
        <span><strong>Credits:</strong> ${c.credits}</span> • 
        <span><strong>Certificate:</strong> ${c.certificate}</span>
      </div>
      <p class="desc">${c.description}</p>
      <div class="tags" aria-label="Technologies">${techTags(c)}</div>
      ${
        c.completed
          ? `<p class="status">True <span class="tick">✓</span></p>`
          : `<p class="status">False</p>`
      }
    </article>
  `;
}

function render(list) {
  if (!courseGrid) return;
  courseGrid.innerHTML = list.map(cardTemplate).join('');
  const total = list.reduce((acc, c) => acc + (c.credits || 0), 0);
  if (creditTotalEl) creditTotalEl.textContent = String(total);
}

function setActive(btn) {
  filterButtons.forEach(b => b.classList.toggle('active', b === btn));
}

function applyFilter(filter) {
  let list = courses.slice();
  if (filter === 'WDD') list = courses.filter(c => c.subject === 'WDD');
  if (filter === 'CSE') list = courses.filter(c => c.subject === 'CSE');
  render(list);
}

// Init
render(courses);

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    setActive(btn);
    applyFilter(btn.dataset.filter);
  });
});

const allBtn = filterButtons.find(b => b.dataset.filter === 'ALL');
if (allBtn) setActive(allBtn);
