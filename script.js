const listsContainer = document.querySelector('[data-lists]');
const newListForm = document.querySelector('[data-new-list-form]');
const newListInput = document.querySelector('[data-new-list-input]');
const deleteListButton = document.querySelector('[data-delete-list-button]');
const listDisplayContainer = document.querySelector('[data-list-display-container]');
const listTitleElement = document.querySelector('[data-list-title]');
const listCountElement = document.querySelector('[data-list-count]');
const tasksContainer = document.querySelector('[data-tasks]');
const taskTemplate = document.getElementById('task-template');
const newTaskForm = document.querySelector('[data-new-task-form]');
const newTaskInput = document.querySelector('[data-new-task-input]');
const newTaskDueDateInput = document.querySelector('[data-new-task-due-date-input]'); // New input for due date
const newTaskPriorityInput = document.querySelector('[data-new-task-priority-input]'); // New input for priority
const clearCompleteTasksButton = document.querySelector('[data-clear-complete-tasks-button]');

const LOCAL_STORAGE_LIST_KEY = 'task.lists';
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId';
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);

document.addEventListener('DOMContentLoaded', () => {
  render();
});

listsContainer.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'li') {
    selectedListId = e.target.dataset.listId;
    saveAndRender();
  }
});

tasksContainer.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'input') {
    const selectedList = lists.find(list => list.id === selectedListId);
    const selectedTask = selectedList.tasks.find(task => task.id === e.target.id);
    selectedTask.complete = e.target.checked;
    save();
    renderTaskCount(selectedList);
  }
});

clearCompleteTasksButton.addEventListener('click', () => {
  const selectedList = lists.find(list => list.id === selectedListId);
  selectedList.tasks = selectedList.tasks.filter(task => !task.complete);
  saveAndRender();
});

deleteListButton.addEventListener('click', () => {
  lists = lists.filter(list => list.id !== selectedListId);
  selectedListId = null;
  saveAndRender();
});

newListForm.addEventListener('submit', e => {
  e.preventDefault();
  const listName = newListInput.value;
  if (listName == null || listName === '') return;
  const list = createList(listName);
  newListInput.value = null;
  lists.push(list);
  saveAndRender();
});

newTaskForm.addEventListener('submit', e => {
  e.preventDefault();
  const taskName = newTaskInput.value;
  const taskDueDate = newTaskDueDateInput.value; // New input for due date
  const taskPriority = newTaskPriorityInput.value; // New input for priority
  if (taskName == null || taskName === '') return;
  const task = createTask(taskName, taskDueDate, taskPriority);
  newTaskInput.value = null;
  newTaskDueDateInput.value = null; // Clear due date input
  newTaskPriorityInput.value = 'low'; // Reset priority input
  const selectedList = lists.find(list => list.id === selectedListId);
  selectedList.tasks.push(task);
  saveAndRender();
});

function createList(name) {
  return { id: Date.now().toString(), name, tasks: [] };
}

function createTask(name, dueDate, priority) {
  return { id: Date.now().toString(), name, dueDate, priority, complete: false };
}

// Add event listener for editing task names
tasksContainer.addEventListener('dblclick', e => {
  if (e.target.tagName.toLowerCase() === 'label') {
    const taskId = e.target.htmlFor;
    const selectedList = lists.find(list => list.id === selectedListId);
    const selectedTask = selectedList.tasks.find(task => task.id === taskId);
    const newTaskName = prompt("Edit task name:", selectedTask.name);
    if (newTaskName != null && newTaskName !== '') {
      selectedTask.name = newTaskName;
      saveAndRender();
    }
  }
});

function saveAndRender() {
  save();
  render();
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId);
}

function render() {
  clearElement(listsContainer);
  renderLists();

  const selectedList = lists.find(list => list.id === selectedListId);
  if (selectedListId == null) {
    listDisplayContainer.style.display = 'none';
  } else {
    listDisplayContainer.style.display = '';
    listTitleElement.innerText = selectedList.name;
    renderTaskCount(selectedList);
    clearElement(tasksContainer);
    renderTasks(selectedList);
  }
}

function renderTasks(selectedList) {
  selectedList.tasks.forEach(task => {
    const taskElement = document.importNode(taskTemplate.content, true);
    const checkbox = taskElement.querySelector('input');
    checkbox.id = task.id;
    checkbox.checked = task.complete;
    const label = taskElement.querySelector('label');
    label.htmlFor = task.id;
    label.append(task.name);

    // Add due date and priority display
    const dueDateElement = document.createElement('span');
    dueDateElement.classList.add('task-due-date');
    dueDateElement.innerText = task.dueDate ? `Due: ${task.dueDate}` : '';
    label.append(dueDateElement);

    const priorityElement = document.createElement('span');
    priorityElement.classList.add('task-priority');
    priorityElement.innerText = `Priority: ${task.priority}`;
    label.append(priorityElement);

    tasksContainer.appendChild(taskElement);
  });
}

function renderTaskCount(selectedList) {
  const incompleteTaskCount = selectedList.tasks.filter(task => !task.complete).length;
  const taskString = incompleteTaskCount === 1 ? "task" : "tasks";
  listCountElement.innerText = `${incompleteTaskCount} ${taskString} remaining`;
}

function renderLists() {
  lists.forEach(list => {
    const listElement = document.createElement('li');
    listElement.dataset.listId = list.id;
    listElement.classList.add("list-name");
    listElement.innerText = list.name;
    if (list.id === selectedListId) {
      listElement.classList.add('active-list');
    }
    listsContainer.appendChild(listElement);
  });
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function rain() {
  const amount = 100;
  const body = document.querySelector('body');
  for (let i = 0; i < amount; i++) {
    const drop = document.createElement('i');
    const size = Math.random() * 5;
    const posX = Math.floor(Math.random() * window.innerWidth);
    const delay = Math.random() * -20;
    const duration = Math.random() * 250;

    drop.style.width = 0.2 + size + 'px';
    drop.style.left = posX + 'px';
    drop.style.animationDelay = delay + 's';
    drop.style.animationDuration = 1 + duration + 's';
    body.appendChild(drop);
  }
}
rain();