// const tasksList = document.querySelector('.tasks__list');
// const token = ('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoi0JjQstCw0L0g0JjQstCw0L3QvtCyIiwibG9naW4iOiJpdmFuMTIzIiwiaWQiOiIxIiwiaWF0IjoxNzI3MzcyMTQ0LCJleHAiOjE3MjczNzU3NDR9.kGvW9pjDYbpUTEGBmLLUzgdMSnBCnkvZ5ZCPkOEZOZ4');
// fetch('https://taskmanager-ynh7.onrender.com/tasks', {
//   method: 'GET',
//   headers: {
//     'Content-Type': 'application/json',
//     'Authorization': `Bearer ${token}`
//   }
// })
// const token = ('Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiNTUiLCJsb2dpbiI6IjU1IiwiaWQiOjIsImlhdCI6MTcyNzM3NjQ4NCwiZXhwIjoxNzI3MzgwMDg0fQ.94_X_UGpN_Q4WXlXA7NF8GLgT6IjVVzAZ_vG7JluXXw');

const token = sessionStorage.getItem('token');
// const apiUrl = 'http://localhost:3000/tasks';
const apiUrl = 'https://taskmanager-ynh7.onrender.com/tasks';

    async function fetchTasks() {
        try {
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                // checkToken();
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }

            const data = await response.json();

            renderTasks(data.tasks);
        } catch (error) {
            // checkToken();
            console.error('Ошибка:', error);
        }
    }


    function renderTasks(tasks) {
        const tasksList = document.querySelector('.tasks__list');
        tasksList.innerHTML = ''; 

        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.classList.add('task');

            const taskInput = document.createElement('input');
            taskInput.type = 'text';
            taskInput.value = task.title;

            const taskButton = document.createElement('button');
            taskButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M8.53033 7.46967L8.44621 7.39705C8.1526 7.1792 7.73594 7.2034 7.46967 7.46967C7.17678 7.76256 7.17678 8.23744 7.46967 8.53033L9.93942 10.9997L7.46967 13.4697L7.39705 13.5538C7.1792 13.8474 7.2034 14.2641 7.46967 14.5303C7.76256 14.8232 8.23744 14.8232 8.53033 14.5303L10.9994 12.0597L13.4697 14.5303L13.5538 14.6029C13.8474 14.8208 14.2641 14.7966 14.5303 14.5303C14.8232 14.2374 14.8232 13.7626 14.5303 13.4697L12.0604 10.9997L14.5303 8.53033L14.6029 8.44621C14.8208 8.1526 14.7966 7.73594 14.5303 7.46967C14.2374 7.17678 13.7626 7.17678 13.4697 7.46967L10.9994 9.93871L8.53033 7.46967Z" fill="black"/>
                </svg>
            `;

            taskButton.addEventListener('click', async () => {
                await deleteTask(task.id);
            });

            taskElement.appendChild(taskInput);
            taskElement.appendChild(taskButton);
            tasksList.appendChild(taskElement);
        });
    }

    // Функция для удаления задачи
    async function deleteTask(taskId) {
        try {
            const response = await fetch(`${apiUrl}/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                // checkToken();
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }

            fetchTasks();
        } catch (error) {
            // checkToken();
            console.error('Ошибка при удалении задачи:', error);
        }
    }

    async function addTask(title) {
        const taskData = {
            title: title,
            description: '32131'
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(taskData)
            });
            // checkToken();
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            fetchTasks();
        } catch (error) {
            // checkToken();
            console.error('Ошибка при добавлении задачи:', error);
        }
    }

    document.querySelector('.add-task-btn').addEventListener('click', () => {
        const taskInput = document.querySelector('.task__input');
        const taskTitle = taskInput.value.trim();

        if (taskTitle) {
            addTask(taskTitle);
            taskInput.value = '';
        } else {
            alert('Пожалуйста, введите название задачи.');
        }
    });

    fetchTasks();

async function fetchUserInfo() {
    const token = sessionStorage.getItem('token');

    try {
        const response = await fetch('https://taskmanager-ynh7.onrender.com/auth/check', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);

        const result = await response.json();
        document.querySelector('.user__name').textContent = result.user.name; 
    } catch (error) {
        // checkToken();
        console.error('Ошибка при получении информации о пользователе:', error);
    }
}

fetchUserInfo();

// async function checkToken() {
//     const token = sessionStorage.getItem('token');

//     if (!token) {
//         window.location.href = 'register.html';
//         return;
//     }

//     try {
//         const response = await fetch('https://taskmanager-ynh7.onrender.com/auth/check', {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`
//             }
//         });

//         if (!response.ok) throw new Error('Ошибка проверки токена');

//         const result = await response.json();
        
//     } catch (error) {
//         console.error('Ошибка при проверке токена:', error);
//         logout();
//     }
// }
// checkToken();


function logout() {
    sessionStorage.removeItem('token');
    window.location.href = 'index.html';
}