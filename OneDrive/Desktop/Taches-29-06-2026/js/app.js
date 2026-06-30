'use strict';

/* ── Utils ────────────────────────────────────────────────── */
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

/* ── Constants ────────────────────────────────────────────── */
const STORAGE_KEY = 'taches-29-06-2026';

const DEFAULT_TASKS = [
  { id: uid(), text: 'Montage vidéo',       done: false },
  { id: uid(), text: 'Réflexion BTS SIO',   done: false },
  { id: uid(), text: 'Développement AM',    done: false },
];

/* ── Persistence ──────────────────────────────────────────── */
const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));

const load = () => {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(data) && data.length ? data : DEFAULT_TASKS;
  } catch {
    return DEFAULT_TASKS;
  }
};

/* ── State ────────────────────────────────────────────────── */
let tasks  = load();
let filter = 'all'; // 'all' | 'pending' | 'done'

/* ── DOM refs ─────────────────────────────────────────────── */
const input        = document.getElementById('task-input');
const addBtn       = document.getElementById('add-btn');
const taskList     = document.getElementById('task-list');
const emptyState   = document.getElementById('empty-state');
const progressBar  = document.getElementById('progress-bar');
const progressLbl  = document.getElementById('progress-label');
const progressPct  = document.getElementById('progress-percent');
const clearDoneBtn = document.getElementById('clear-done-btn');
const dateDisplay  = document.getElementById('date-display');
const filterBtns   = document.querySelectorAll('.filter-btn');

/* ── Core functions ───────────────────────────────────────── */
const addTask = () => {
  const text = input.value.trim();
  if (!text) {
    input.focus();
    input.classList.add('ring-2', 'ring-rose-500/50');
    setTimeout(() => input.classList.remove('ring-2', 'ring-rose-500/50'), 800);
    return;
  }
  tasks.unshift({ id: uid(), text, done: false });
  input.value = '';
  input.focus();
  save();
  render();
};

const toggleTask = (id) => {
  const task = tasks.find(t => t.id === id);
  if (task) task.done = !task.done;
  save();
  render();
};

const deleteTask = (id) => {
  const li = document.querySelector(`[data-id="${id}"]`);
  if (!li) return;
  li.classList.add('removing');
  li.addEventListener('animationend', () => {
    tasks = tasks.filter(t => t.id !== id);
    save();
    render();
  }, { once: true });
};

/* ── Render ───────────────────────────────────────────────── */
const updateProgress = () => {
  const total = tasks.length;
  const done  = tasks.filter(t => t.done).length;
  const pct   = total === 0 ? 0 : Math.round((done / total) * 100);

  progressLbl.textContent = `${done} / ${total} complétée${done > 1 ? 's' : ''}`;
  progressPct.textContent = `${pct}%`;
  progressBar.style.width = `${pct}%`;

  progressBar.style.background = (pct === 100 && total > 0)
    ? 'linear-gradient(90deg, #059669, #10b981)'
    : 'linear-gradient(90deg, #7c3aed, #a78bfa)';
};

const createItem = (task) => {
  const li = document.createElement('li');
  li.className = `task-item${task.done ? ' done' : ''}`;
  li.dataset.id = task.id;

  const checkbox = document.createElement('input');
  checkbox.type      = 'checkbox';
  checkbox.className = 'task-checkbox';
  checkbox.checked   = task.done;
  checkbox.addEventListener('change', () => toggleTask(task.id));

  const label = document.createElement('span');
  label.className   = 'task-label';
  label.textContent = task.text;
  label.addEventListener('click', () => toggleTask(task.id));

  const delBtn = document.createElement('button');
  delBtn.className = 'delete-btn';
  delBtn.title     = 'Supprimer';
  delBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
    </svg>`;
  delBtn.addEventListener('click', () => deleteTask(task.id));

  li.appendChild(checkbox);
  li.appendChild(label);
  li.appendChild(delBtn);
  return li;
};

const render = () => {
  const visible = tasks.filter(t => {
    if (filter === 'pending') return !t.done;
    if (filter === 'done')    return t.done;
    return true;
  });

  taskList.innerHTML = '';

  if (visible.length === 0) {
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');
    visible.forEach(task => taskList.appendChild(createItem(task)));
  }

  updateProgress();
};

/* ── Event listeners ──────────────────────────────────────── */
addBtn.addEventListener('click', addTask);

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTask();
});

clearDoneBtn.addEventListener('click', () => {
  tasks = tasks.filter(t => !t.done);
  save();
  render();
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filter = btn.dataset.filter;
    filterBtns.forEach(b => b.classList.remove('active-filter'));
    btn.classList.add('active-filter');
    render();
  });
});

/* ── Init ─────────────────────────────────────────────────── */
const now = new Date();
dateDisplay.textContent = now.toLocaleDateString('fr-FR', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
});
document.getElementById('footer-date').textContent = now.toLocaleDateString('fr-FR', {
  day: 'numeric', month: 'long', year: 'numeric'
});

render();
