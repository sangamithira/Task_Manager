const STORAGE_KEY = 'study-sprint-state';

const defaultTasks = [
  { id: 1, text: 'Biology chapter summary', subject: 'Biology', priority: 'High', done: false },
  { id: 2, text: 'Calculus problem set 8', subject: 'Math', priority: 'Medium', done: true },
  { id: 3, text: 'History essay outline', subject: 'History', priority: 'Low', done: false },
  { id: 4, text: 'Chemistry flashcards', subject: 'Chemistry', priority: 'Medium', done: false }
];

const defaultGoals = [
  { id: 1, text: 'Complete 2 hours of revision', done: true },
  { id: 2, text: 'Finish lab report draft', done: false },
  { id: 3, text: 'Review 30 past exam questions', done: false }
];

const tasks = loadState('tasks', defaultTasks);
const goals = loadState('goals', defaultGoals);

const subjectPlans = [
  { name: 'Math', target: 'Algebra mastery', progress: 82, hours: '7 hrs', exam: 'Oct 21' },
  { name: 'Biology', target: 'Cell biology review', progress: 68, hours: '5 hrs', exam: 'Oct 24' },
  { name: 'Chemistry', target: 'Organic chemistry', progress: 76, hours: '6 hrs', exam: 'Oct 28' },
  { name: 'History', target: 'Essay planning', progress: 59, hours: '4 hrs', exam: 'Nov 1' }
];

const examTimeline = [
  { date: 'Mon 14', title: 'Math practice paper', detail: 'Past paper review' },
  { date: 'Tue 15', title: 'Biology topic recap', detail: 'Unit 3 summary' },
  { date: 'Thu 17', title: 'Chemistry lab revision', detail: 'Reaction mechanisms' },
  { date: 'Fri 18', title: 'History essay drill', detail: 'Plan and write' }
];

const taskList = document.getElementById('taskList');
const goalList = document.getElementById('goalList');
const subjectGrid = document.getElementById('subjectGrid');
const timelineList = document.getElementById('timelineList');
const assignmentsCount = document.getElementById('assignmentsCount');
const goalsCount = document.getElementById('goalsCount');
const studyHours = document.getElementById('studyHours');
const examPrep = document.getElementById('examPrep');
const taskForm = document.getElementById('taskForm');
const goalForm = document.getElementById('goalForm');
const taskInput = document.getElementById('taskInput');
const goalInput = document.getElementById('goalInput');
const subjectSelect = document.getElementById('subjectSelect');
const filterButtons = document.querySelectorAll('.filter-btn');
const navButtons = document.querySelectorAll('.nav-item');

let activeFilter = 'all';

function priorityClass(priority) {
  return priority.toLowerCase() === 'high'
    ? 'high'
    : priority.toLowerCase() === 'medium'
      ? 'medium'
      : 'low';
}

function renderTasks() {
  const visibleTasks = tasks.filter((task) => {
    if (activeFilter === 'pending') return !task.done;
    if (activeFilter === 'done') return task.done;
    return true;
  });

  taskList.innerHTML = visibleTasks
    .map(
      (task) => `
        <li class="task-item ${task.done ? 'done' : ''}" data-id="${task.id}">
          <div class="task-main">
            <button class="task-check" type="button" aria-label="Toggle task completion" data-action="toggle-task" data-id="${task.id}">${task.done ? '✓' : ''}</button>
            <div>
              <span class="task-text">${task.text}</span>
              <span class="task-meta">${task.subject} • ${task.priority} priority</span>
            </div>
          </div>
          <div class="task-actions">
            <span class="tag ${priorityClass(task.priority)}">${task.priority}</span>
          </div>
        </li>
      `
    )
    .join('');

  if (!visibleTasks.length) {
    taskList.innerHTML = '<li class="task-item"><div class="task-main"><div><span class="task-text">No tasks in this view</span><span class="task-meta">Try another filter or add a new task.</span></div></div></li>';
  }
}

function renderGoals() {
  goalList.innerHTML = goals
    .map(
      (goal) => `
        <li class="goal-item ${goal.done ? 'done' : ''}" data-id="${goal.id}">
          <div class="goal-main">
            <button class="goal-check" type="button" aria-label="Toggle goal completion" data-action="toggle-goal" data-id="${goal.id}">${goal.done ? '✓' : ''}</button>
            <div>
              <span class="goal-text">${goal.text}</span>
              <span class="goal-meta">${goal.done ? 'Completed' : 'In progress'}</span>
            </div>
          </div>
        </li>
      `
    )
    .join('');
}

function renderSubjectPlans() {
  subjectGrid.innerHTML = subjectPlans
    .map(
      (subject) => `
        <article class="subject-card">
          <div class="subject-top">
            <h4>${subject.name}</h4>
            <span class="tag low">${subject.hours}</span>
          </div>
          <div class="progress-shell" aria-label="${subject.name} progress">
            <div class="progress-bar" style="width: ${subject.progress}%"></div>
          </div>
          <div class="subject-meta">
            <span>${subject.target}</span>
            <strong>${subject.progress}%</strong>
          </div>
          <div class="subject-meta">
            <span>Next exam</span>
            <strong>${subject.exam}</strong>
          </div>
        </article>
      `
    )
    .join('');
}

function renderTimeline() {
  timelineList.innerHTML = examTimeline
    .map(
      (item) => `
        <li class="timeline-item">
          <span class="timeline-badge"></span>
          <div class="timeline-copy">
            <strong>${item.title}</strong>
            <span class="timeline-meta">${item.detail}</span>
          </div>
          <span class="tag medium">${item.date}</span>
        </li>
      `
    )
    .join('');
}

function loadState(key, fallback) {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return fallback;

  try {
    const parsed = JSON.parse(saved);
    return parsed[key] || fallback;
  } catch (error) {
    return fallback;
  }
}

function saveState() {
  const appState = {
    tasks,
    goals
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}

function updateSummary() {
  const completedGoals = goals.filter((goal) => goal.done).length;
  const completedTasks = tasks.filter((task) => task.done).length;
  const studyTotal = 12 + completedTasks * 1.2;

  assignmentsCount.textContent = tasks.length;
  goalsCount.textContent = completedGoals;
  studyHours.textContent = `${Math.round(studyTotal)}h`;

  const prepProgress = Math.round(
    (subjectPlans.reduce((total, subject) => total + subject.progress, 0) / subjectPlans.length)
  );
  examPrep.textContent = `${prepProgress}%`;
}

function setActiveNav(targetId) {
  navButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.target === targetId);
  });

  const target = document.getElementById(targetId);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function bindNavigation() {
  navButtons.forEach((button) => {
    button.addEventListener('click', () => setActiveNav(button.dataset.target));
  });
}

function addTask(event) {
  event.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;

  tasks.unshift({
    id: Date.now(),
    text,
    subject: subjectSelect.value,
    priority: 'Medium',
    done: false
  });

  taskInput.value = '';
  renderTasks();
  updateSummary();
  saveState();
}

function addGoal(event) {
  event.preventDefault();
  const text = goalInput.value.trim();
  if (!text) return;

  goals.unshift({
    id: Date.now(),
    text,
    done: false
  });

  goalInput.value = '';
  renderGoals();
  updateSummary();
  saveState();
}

function toggleTask(id) {
  const task = tasks.find((item) => item.id === Number(id));
  if (!task) return;
  task.done = !task.done;
  renderTasks();
  updateSummary();
  saveState();
}

function toggleGoal(id) {
  const goal = goals.find((item) => item.id === Number(id));
  if (!goal) return;
  goal.done = !goal.done;
  renderGoals();
  updateSummary();
  saveState();
}

taskList.addEventListener('click', (event) => {
  const target = event.target.closest('[data-action]');
  if (!target) return;
  const { action, id } = target.dataset;
  if (action === 'toggle-task') toggleTask(id);
});

goalList.addEventListener('click', (event) => {
  const target = event.target.closest('[data-action]');
  if (!target) return;
  const { action, id } = target.dataset;
  if (action === 'toggle-goal') toggleGoal(id);
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((item) => item.classList.toggle('active', item === button));
    activeFilter = button.dataset.filter;
    renderTasks();
  });
});

bindNavigation();

taskForm.addEventListener('submit', addTask);
goalForm.addEventListener('submit', addGoal);

renderTasks();
renderGoals();
renderSubjectPlans();
renderTimeline();
updateSummary();
