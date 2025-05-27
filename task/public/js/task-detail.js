document.addEventListener('DOMContentLoaded', function() {
    // DOM元素
    const taskDetail = document.getElementById('taskDetail');
    const editModal = document.getElementById('editModal');
    const closeBtn = document.querySelector('.close');
    const editTaskForm = document.getElementById('editTaskForm');
    const editTaskId = document.getElementById('editTaskId');
    const editTaskTitle = document.getElementById('editTaskTitle');
    const editTaskDescription = document.getElementById('editTaskDescription');
    const editTaskCompleted = document.getElementById('editTaskCompleted');

    // 从URL获取任务ID
    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get('id');

    // 从localStorage获取token
    const token = localStorage.getItem('token');

    if (!token) {
        // 如果没有token，重定向到登录页面
        window.location.href = '/login.html';
    }

    // 如果没有任务ID，重定向到任务列表
    if (!taskId) {
        window.location.href = '/tasks.html';
    }

    // 加载任务详情
    async function loadTaskDetail() {
        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                headers: {
                    'x-auth-token': token,
                },
            });

            const task = await response.json();

            if (response.ok) {
                // 显示任务详情
                taskDetail.innerHTML = `
                    <h2>${task.title}</h2>
                    <div class="form-group">
                        <label>Description:</label>
                        <p>${task.description || 'No description'}</p>
                    </div>
                    <div class="form-group">
                        <label>Status:</label>
                        <p>${task.completed ? 'Completed' : 'Pending'}</p>
                    </div>
                    <div class="task-actions">
                        <button id="editTaskBtn" class="btn btn-primary">Edit Task</button>
                        <button id="deleteTaskBtn" class="btn btn-danger">Delete Task</button>
                    </div>
                `;

                // 添加编辑按钮事件
                document.getElementById('editTaskBtn').addEventListener('click', function() {
                    editTask(task);
                });

                // 添加删除按钮事件
                document.getElementById('deleteTaskBtn').addEventListener('click', function() {
                    deleteTask(taskId);
                });
            } else {
                alert('Failed to load task.');
                window.location.href = '/tasks.html';
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while loading the task.');
            window.location.href = '/tasks.html';
        }
    }

    // 编辑任务
    function editTask(task) {
        editTaskId.value = task._id;
        editTaskTitle.value = task.title;
        editTaskDescription.value = task.description || '';
        editTaskCompleted.checked = task.completed;
        editModal.style.display = 'block';
    }

    // 关闭模态框
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            editModal.style.display = 'none';
        });
    }

    // 点击模态框外部关闭模态框
    window.addEventListener('click', function(event) {
        if (event.target == editModal) {
            editModal.style.display = 'none';
        }
    });

    // 提交编辑表单
    if (editTaskForm) {
        editTaskForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const title = editTaskTitle.value;
            const description = editTaskDescription.value;
            const completed = editTaskCompleted.checked;

            try {
                const response = await fetch(`/api/tasks/${taskId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token,
                    },
                    body: JSON.stringify({ title, description, completed }),
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Task updated successfully!');
                    editModal.style.display = 'none';
                    loadTaskDetail();
                } else {
                    alert(data.msg || 'Failed to update task.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while updating the task.');
            }
        });
    }

    // 删除任务
    async function deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            try {
                const response = await fetch(`/api/tasks/${taskId}`, {
                    method: 'DELETE',
                    headers: {
                        'x-auth-token': token,
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Task deleted successfully!');
                    window.location.href = '/tasks.html';
                } else {
                    alert(data.msg || 'Failed to delete task.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while deleting the task.');
            }
        }
    }

    // 初始加载任务详情
    loadTaskDetail();
});