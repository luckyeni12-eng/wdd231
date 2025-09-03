// course.js — course array, completion flags, filtering, cards, dynamic credits

// Course array
const courses = [
  {
    subject: 'CSE',
    number: 110,
    title: 'Introduction to Programming',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'This course will introduce students to programming. It will introduce the building blocks of programming languages (variables, decisions, calculations, loops, array, and input/output) and use them to solve problems.',
    technology: ['Python'],
    completed: true
  },
  {
    subject: 'WDD',
    number: 130,
    title: 'Web Fundamentals',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'This course introduces students to the World Wide Web and to careers in web site design and development. The course is hands on with students actually participating in simple web designs and programming. It is anticipated that students who complete this course will understand the fields of web design and development and will have a good idea if they want to pursue this degree as a major.',
    technology: ['HTML', 'CSS'],
    completed: true
  },
  {
    subject: 'CSE',
    number: 111,
    title: 'Programming with Functions',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'CSE 111 students become more organized, efficient, and powerful computer programmers by learning to research and call functions written by others; to write, call , debug, and test their own functions; and to handle errors within functions. CSE 111 students write programs with functions to solve problems in many disciplines, including business, physical science, human performance, and humanities.',
    technology: ['Python'],
    completed: true
  },
  {
    subject: 'CSE',
    number: 210,
    title: 'Programming with Classes',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'This course will introduce the notion of classes and objects. It will present encapsulation at a conceptual level. It will also work with inheritance and polymorphism.',
    technology: ['C#'],
    completed: true
  },
  {
    subject: 'WDD',
    number: 131,
    title: 'Dynamic Web Fundamentals',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'This course builds on prior experience in Web Fundamentals and programming. Students will learn to create dynamic websites that use JavaScript to respond to events, update content, and create responsive user experiences.',
    technology: ['HTML', 'CSS', 'JavaScript'],
    completed: true
  },
  {
    subject: 'WDD',
    number: 231,
    title: 'Frontend Web Development I',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'This course builds on prior experience with Dynamic Web Fundamentals and programming. Students will focus on user experience, accessibility, compliance, performance optimization, and basic API usage.',
    technology: ['HTML', 'CSS', 'JavaScript'],
    completed: false
  }
];

const courseGrid = document.getElementById('courses');
const creditTotalEl = document.getElementById('credit-total');
const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));

// Render utility
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
      ${c.completed ? `<p class="status" aria-label="Completed course">✓ Completed</p>` : ``}
    </article>
  `;
}

function render(list) {
  if (!courseGrid) return;
  courseGrid.innerHTML = list.map(cardTemplate).join('');
  // Dynamic reduce: sum only visible credits
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

// Default active = All
const allBtn = filterButtons.find(b => b.dataset.filter === 'ALL');
if (allBtn) setActive(allBtn);
