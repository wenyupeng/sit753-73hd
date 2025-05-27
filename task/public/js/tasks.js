document.addEventListener("DOMContentLoaded", function () {
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskModal = document.getElementById("taskModal");
    const closeBtn = document.querySelector(".close");
    const taskForm = document.getElementById("taskForm");
    const modalTitle = document.getElementById("modalTitle");
    const tasksList = document.getElementById("tasksList");
    const taskIdInput = document.getElementById("taskId");

    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "/login.html";
    }

    if (addTaskBtn) {
        addTaskBtn.addEventListener("click", function () {
            taskForm.reset();
            modalTitle.textContent = "Add Task";
            taskIdInput.value = "";
            taskModal.style.display = "block";
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", function () {
            taskModal.style.display = "none";
        });
    }

    window.addEventListener("click", function (event) {
        if (event.target == taskModal) {
            taskModal.style.display = "none";
        }
    });

    if (taskForm) {
        taskForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const title = document.getElementById("taskTitle").value;
            const description = document.getElementById("taskDescription").value;
            const completed = document.getElementById("taskCompleted").checked;
            const taskId = taskIdInput.value;

            try {
                let response;
                let data;

                if (taskId) {
                    response = await fetch(`/api/tasks/${taskId}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "x-auth-token": token,
                        },
                        body: JSON.stringify({ title, description, completed }),
                    });

                    data = await response.json();

                    if (response.ok) {
                        alert("Task updated successfully!");
                    } else {
                        alert(data.msg || "Failed to update task.");
                        return;
                    }
                } else {
                    response = await fetch("/api/tasks", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "x-auth-token": token,
                        },
                        body: JSON.stringify({ title, description, completed }),
                    });

                    data = await response.json();

                    if (response.ok) {
                        alert("Task added successfully!");
                    } else {
                        alert(data.msg || "Failed to add task.");
                        return;
                    }
                }

                taskModal.style.display = "none";
                loadTasks();
            } catch (error) {
                console.error("Error:", error);
                alert("An error occurred while processing the task.");
            }
        });
    }

    async function loadTasks() {
        if (!tasksList) return;

        try {
            const response = await fetch("/api/tasks", {
                headers: {
                    "x-auth-token": token,
                },
            });

            const tasks = await response.json();

            if (response.ok) {
                tasksList.innerHTML = "";

                if (tasks.length === 0) {
                    tasksList.innerHTML = "<p class='no-tasks'>No tasks found.</p>";
                    return;
                }

                tasks.forEach(task => {
                    const taskCard = document.createElement("div");
                    taskCard.className = `task-card ${task.completed ? "completed" : ""}`;
                    taskCard.innerHTML = `
                        <h3>${task.title}</h3>
                        <p>${task.description || "No description"}</p>
                        <div class="task-meta">
                            <span>Status: ${task.completed ? "Completed" : "Pending"}</span>
                        </div>
                        <div class="task-actions">
                            <a href="/task-detail.html?id=${task._id}" class="btn btn-secondary">View</a>
                            <button class="btn btn-primary edit-btn" data-id="${task._id}">Edit</button>
                            <button class="btn btn-danger delete-btn" data-id="${task._id}">Delete</button>
                        </div>
                    `;
                    tasksList.appendChild(taskCard);
                });

                document.querySelectorAll(".edit-btn").forEach(btn => {
                    btn.addEventListener("click", function () {
                        const taskId = this.getAttribute("data-id");
                        editTask(taskId);
                    });
                });

                document.querySelectorAll(".delete-btn").forEach(btn => {
                    btn.addEventListener("click", function () {
                        const taskId = this.getAttribute("data-id");
                        deleteTask(taskId);
                    });
                });
            } else {
                alert("Failed to load tasks.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while loading tasks.");
        }
    }

    async function editTask(taskId) {
        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                headers: {
                    "x-auth-token": token,
                },
            });

            const task = await response.json();

            if (response.ok) {
                document.getElementById("taskTitle").value = task.title;
                document.getElementById("taskDescription").value = task.description || "";
                document.getElementById("taskCompleted").checked = task.completed;
                taskIdInput.value = task._id;
                modalTitle.textContent = "Edit Task";
                taskModal.style.display = "block";
            } else {
                alert("Failed to load task for editing.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while loading the task.");
        }
    }

    async function deleteTask(taskId) {
        if (confirm("Are you sure you want to delete this task?")) {
            try {
                const response = await fetch(`/api/tasks/${taskId}`, {
                    method: "DELETE",
                    headers: {
                        "x-auth-token": token,
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    alert("Task deleted successfully!");
                    loadTasks();
                } else {
                    alert(data.msg || "Failed to delete task.");
                }
            } catch (error) {
                console.error("Error:", error);
                alert("An error occurred while deleting the task.");
            }
        }
    }

    loadTasks();
});