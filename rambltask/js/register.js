const apiUrlRegister = 'https://taskmanager-ynh7.onrender.com/users/register';
// const apiUrlRegister= 'http://localhost:3000/users/register';
const apiUrlLogin = 'https://taskmanager-ynh7.onrender.com/auth';
// const apiUrlLogin = 'http://localhost:3000/auth';
    // Функция для регистрации нового пользователя
    async function registerUser(name, login, password) {
        const userData = { name, login, password };

        try {
            const response = await fetch(apiUrlRegister, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);

            const result = await response.json();
            document.querySelector('.auth-message').textContent = 'Регистрация прошла успешно! Теперь войдите в систему.';
            loginUser(login, password);
        } catch (error) {
            console.error('Ошибка при регистрации:', error);
            document.querySelector('.auth-message').textContent = 'Ошибка регистрации. Попробуйте еще раз.';
        }
    }

    async function loginUser(login, password) {
        const userData = { login, password };

        try {
            const response = await fetch(apiUrlLogin, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);

            const result = await response.json();
            sessionStorage.setItem('token', result.token);  // Сохраняем токен в sessionStorage
            document.querySelector('.auth-message').textContent = 'Успешный вход в систему!';
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Ошибка при входе:', error);
            document.querySelector('.auth-message').textContent = 'Ошибка входа. Проверьте логин и пароль.';
        }
    }

    document.querySelector('.register-btn').addEventListener('click', () => {
        const nameInput = document.querySelector('.name__input');
        const loginInput = document.querySelector('.register-login__input');
        const passwordInput = document.querySelector('.register-password__input');
    
        const name = nameInput.value.trim();
        const login = loginInput.value.trim();
        const password = passwordInput.value.trim();
    
        if (name && login && password) {
            registerUser(name, login, password);
            nameInput.value = '';
            loginInput.value = '';
            passwordInput.value = '';
        } else {
            alert('Пожалуйста, заполните все поля.');
        }
    });

    // Обработчик события для входа
    document.querySelector('.login-btn').addEventListener('click', () => {
        const loginInput = document.querySelector('.login-login__input');
        const passwordInput = document.querySelector('.login-password__input');
    
        const login = loginInput.value.trim();
        const password = passwordInput.value.trim();
        
        if (login && password) {
            loginUser(login, password);
            loginInput.value = '';
            passwordInput.value = '';
        } else {
            alert('Пожалуйста, заполните логин и пароль.');
        }
    });
    

    // Обработчик переключения между формами
    document.querySelectorAll('.toggle-btn').forEach(button => {
        button.addEventListener('click', () => {
            const authForm = document.querySelector('.auth-form');
            const loginForm = document.querySelector('.login-form');
            const isLogin = loginForm.style.display === 'none';
    
            // Переключение видимости
            
            loginForm.style.display = isLogin ? 'flex' : 'none';
            authForm.style.display = isLogin ? 'none' : 'flex';
            // Очистка сообщений
            document.querySelector('.auth-message').textContent = ''; 
        });
    });

