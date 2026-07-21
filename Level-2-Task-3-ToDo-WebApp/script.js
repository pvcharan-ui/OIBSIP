// ======================================
// PVS TASK MANAGER
// script.js
// ======================================

// ---------- Elements ----------
const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priority");
const dueDateInput = document.getElementById("dueDate");
const addTaskBtn = document.getElementById("addTask");

const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter");

const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

// ---------- Variables ----------
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// ---------- Save ----------
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ---------- Dashboard ----------
function updateDashboard() {

    totalTasks.textContent = tasks.length;

    completedTasks.textContent =
        tasks.filter(task => task.completed).length;

    pendingTasks.textContent =
        tasks.filter(task => !task.completed).length;
}

// ---------- Add Task ----------
function addTask() {

    const text = taskInput.value.trim();
    const priority = priorityInput.value;
    const dueDate = dueDateInput.value;

    if (text === "") {

        alert("Please enter a task.");

        return;
    }

    const task = {

        id: Date.now(),

        text: text,

        priority: priority,

        dueDate: dueDate,

        completed: false
    };

    tasks.unshift(task);

    saveTasks();

    taskInput.value = "";

    dueDateInput.value = "";

    renderTasks();
}

// ---------- Delete ----------
function deleteTask(id) {

    if (!confirm("Delete this task?"))
        return;

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();

    renderTasks();
}

// ---------- Complete ----------
function toggleComplete(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {

            task.completed = !task.completed;
        }

        return task;
    });

    saveTasks();

    renderTasks();
}

// ---------- Edit ----------
function editTask(id) {

    const task = tasks.find(t => t.id === id);

    const updated = prompt("Edit Task", task.text);

    if (updated === null)
        return;

    if (updated.trim() === "")
        return;

    task.text = updated.trim();

    saveTasks();

    renderTasks();
}// ---------- Render Tasks ----------
function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(task => {

        const matchesSearch = task.text
            .toLowerCase()
            .includes(searchInput.value.toLowerCase());

        if (currentFilter === "completed")
            return task.completed && matchesSearch;

        if (currentFilter === "pending")
            return !task.completed && matchesSearch;

        return matchesSearch;
    });

    if (filteredTasks.length === 0) {

        taskList.innerHTML = `
            <li class="task">
                <div class="task-info">
                    <h3>No Tasks Found</h3>
                    <p>Add a task to get started.</p>
                </div>
            </li>
        `;

        updateDashboard();
        return;
    }

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.className = "task";

        let priorityClass = "";

        if (task.priority === "High")
            priorityClass = "high";

        else if (task.priority === "Medium")
            priorityClass = "medium";

        else
            priorityClass = "low";

        li.innerHTML = `

            <div class="task-info">

                <h3
                    style="
                    ${task.completed
                        ? "text-decoration:line-through;opacity:.6;"
                        : ""}
                    ">
                    ${task.text}
                </h3>

                <p>
                    📅
                    ${
                        task.dueDate === ""
                        ? "No Due Date"
                        : task.dueDate
                    }
                </p>

                <span class="priority ${priorityClass}">
                    ${task.priority}
                </span>

            </div>

            <div class="actions">

                <button
                    class="complete"
                    onclick="toggleComplete(${task.id})">

                    ${
                        task.completed
                        ? "↺"
                        : "✓"
                    }

                </button>

                <button
                    class="edit"
                    onclick="editTask(${task.id})">

                    ✏️

                </button>

                <button
                    class="delete"
                    onclick="deleteTask(${task.id})">

                    🗑️

                </button>

            </div>

        `;

        taskList.appendChild(li);

    });

    updateDashboard();
}// ---------- Search ----------
searchInput.addEventListener("input", function () {

    renderTasks();

});

// ---------- Filters ----------
filterButtons.forEach(button => {

    button.addEventListener("click", function () {

        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        this.classList.add("active");

        currentFilter = this.dataset.filter;

        renderTasks();

    });

});

// ---------- Add Task Button ----------
addTaskBtn.addEventListener("click", addTask);

// ---------- Enter Key ----------
taskInput.addEventListener("keypress", function (e) {

    if (e.key === "Enter") {

        addTask();

    }

});

// ---------- Sort Tasks ----------
function sortTasks() {

    tasks.sort((a, b) => {

        if (a.completed !== b.completed) {

            return a.completed - b.completed;

        }

        const priorityOrder = {

            High: 1,

            Medium: 2,

            Low: 3

        };

        return priorityOrder[a.priority] - priorityOrder[b.priority];

    });

}

// ---------- Render Wrapper ----------
const originalRender = renderTasks;

renderTasks = function () {

    sortTasks();

    originalRender();

};

// ---------- Initialize ----------
renderTasks();