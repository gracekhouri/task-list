
class Task {
  constructor(task, completed, dateCompleted) {
    this.id = UUID.generate();
    this.name = task;
    this.completed = completed;
    this.dateCompleted = dateCompleted;
  }
}


class StorageService {
  constructor() {
    this.tasks = [];
    this.populateTasks();
  }

  populateTasks() {
    let tasks = [];
    let tasksAsString = localStorage.getItem('tasks');
    if (tasksAsString) {
      const taskObjects = JSON.parse(tasksAsString);
      tasks = taskObjects.map(t => new Task(t.name, t.completed, t.dateCompleted));
    }

    this.tasks = tasks;
  }

  addTask(task) {
    this.tasks.push(task);

    const tasksAsString = JSON.stringify(this.tasks);
    localStorage.setItem('tasks', tasksAsString);
  }

  updateTask(task) {
    // TODO:
  }

  removeTask(uuid) {
    // TODO:
    let taskList = this.populateTasks();
    //NOT SURE ABOUT THE FOLLOWING LINE
    taskList = taskList.filter(task => task.id != uuid);
    localStorage.setItem('taskList', JSON.stringify(taskList));
  }
}

class UserInterface {
  constructor() {
    this.storage = new StorageService();
    this.table = document.getElementById('table-body');
    this.taskInput = document.getElementById('task-input');
  }

  initialize() {
    this.initializeFormSubmitListener();
    this.populateTasksTable();
  }

  initializeFormSubmitListener() {
    const taskForm = document.getElementById('task-form');
    taskForm.addEventListener('submit', (e) => {
      e.preventDefault();

      this.createTaskFromInput();
      this.clearFormInputs();
      this.populateTasksTable();
    });
  }

  createTaskFromInput() {
    const taskName = this.taskInput.value;

    const task = new Task(taskName, false, null);

    this.storage.addTask(task);
  }

  populateTasksTable() {
    this.clearTable();

    for (const task of this.storage.tasks) {
      this.addTaskToTable(task);
    }
  }

  clearTable() {
    let length = this.table.children.length;
    for (let i = 0; i < length; i++) {
      const row = this.table.children[0];
      row.remove();
    }
  }

  addTaskToTable(task) {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${task.name}</td>
      <td>${this.getCompleteIconHtml(task.completed)}</td>
      <td>${this.formatDate(task.dateCompleted)}</td>
      <td>Remove</td>
    `;

    // TODO: add id attribute to row
    row.setAttribute('id', task.id);
    this.table.append(row);
    this.addCompleteTaskListenerToRow(row);
    this.addDeleteListenerToRow(row, task);
  }

  getCompleteIconHtml(completed) {
    return `<div class="form-check">
              <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
              <label class="form-check-label" for="flexCheckDefault">
                  Not Completed
              </label>
            </div>`
  }

  formatDate(date) {
    if (date) {
      return date;
    } else {
      return new Date();
    }
  }

  addCompleteTaskListenerToRow(row) {
    // TODO
    row.children[1].addEventListener('click', (e) =>{
      row.children[1].innerHTML = 
        `<td>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked>
              <label class="form-check-label" for="flexCheckChecked">
                    Completed
              </label>
            </div>`
      
    });
  }

  addDeleteListenerToRow(row, task) {
    // TODO
    row.children[3].addEventListener('click', (e) => {
      const uuid = e.target.getAttribute(task.id);
      this.storage.removeTask(uuid);
      this.populateTasksTable();
    });
  }

  clearFormInputs() {
    this.taskInput.value = '';
  }
}


document.addEventListener('DOMContentLoaded', () => {
  const ui = new UserInterface();
  ui.initialize();
});
