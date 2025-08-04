// MODELO (Model)
class Task {
    constructor(text) {
        this.id = new Date().getTime();
        this.text = text;
        this.completed = false;
    }
}

// VISTA (View)
class View {
    constructor() {
        this.taskList = document.getElementById('task-list');
        this.newTaskInput = document.getElementById('new-task');
        this.addTaskButton = document.getElementById('add-task');
        this.filterAllButton = document.getElementById('filter-all');
        this.filterPendingButton = document.getElementById('filter-pending');
        this.filterCompletedButton = document.getElementById('filter-completed');
        this.deleteAllButton = document.getElementById('delete-all');
    }

    renderTasks(tasks) {
        this.taskList.innerHTML = '';
        if (tasks.length === 0) {
            this.taskList.innerHTML = '<p class="text-center text-muted">¡No hay tareas!</p>';
            return;
        }

        tasks.forEach(task => {
            const taskCard = document.createElement('div');
            taskCard.className = `card mb-2 ${task.completed ? 'task-completed' : ''}`;
            taskCard.dataset.id = task.id;
            taskCard.innerHTML = `
                <div class="card-body d-flex justify-content-between align-items-center">
                    <span class="${task.completed ? 'text-decoration-line-through' : ''}">${task.text}</span>
                    <div>
                        <button class="btn btn-sm btn-success complete-btn"><i class="fas fa-check"></i></button>
                        <button class="btn btn-sm btn-danger delete-btn"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `;
            this.taskList.appendChild(taskCard);
        });
    }
}

// CONTROLADOR (Controller)
class Controller {
    constructor() {
        this.view = new View();
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.currentFilter = 'all';

        this.view.addTaskButton.addEventListener('click', () => this.addTask());
        this.view.deleteAllButton.addEventListener('click', () => this.deleteAllTasks());
        this.view.taskList.addEventListener('click', (e) => {
            if (e.target.closest('.complete-btn')) {
                this.completeTask(e.target.closest('.card').dataset.id);
            }
            if (e.target.closest('.delete-btn')) {
                this.deleteTask(e.target.closest('.card').dataset.id);
            }
        });

        this.view.filterAllButton.addEventListener('click', () => this.setFilter('all'));
        this.view.filterPendingButton.addEventListener('click', () => this.setFilter('pending'));
        this.view.filterCompletedButton.addEventListener('click', () => this.setFilter('completed'));

        this.render();
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    addTask() {
        const text = this.view.newTaskInput.value.trim();
        if (text) {
            this.tasks.push(new Task(text));
            this.view.newTaskInput.value = '';
            this.saveTasks();
            this.render();
        }
    }

    completeTask(id) {
        const task = this.tasks.find(task => task.id == id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.render();
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id != id);
        this.saveTasks();
        this.render();
    }

    deleteAllTasks() {
        this.tasks = [];
        this.saveTasks();
        this.render();
    }

    setFilter(filter) {
        this.currentFilter = filter;
        this.render();
    }

    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'pending':
                return this.tasks.filter(task => !task.completed);
            case 'completed':
                return this.tasks.filter(task => task.completed);
            default:
                return this.tasks;
        }
    }

    render() {
        const filteredTasks = this.getFilteredTasks();
        this.view.renderTasks(filteredTasks);
        this.updateFilterButtons();
    }

    updateFilterButtons() {
        this.view.filterAllButton.classList.toggle('active', this.currentFilter === 'all');
        this.view.filterPendingButton.classList.toggle('active', this.currentFilter === 'pending');
        this.view.filterCompletedButton.classList.toggle('active', this.currentFilter === 'completed');
    }
}

// Inicializar la aplicación
const app = new Controller();