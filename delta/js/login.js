// Функция для входа пользователя
async function loginUser() {
    const username = document.getElementById('login-username').value; // Получаем имя пользователя
    const password = document.getElementById('login-password').value; // Получаем пароль

    // Проверяем учетные данные пользователя
    const { data: user, error } = await _supabase
        .from('users')
        .select('id, username')
        .eq('username', username)
        .eq('password', password)
        .single(); // Ожидаем только одну запись

    if (error) {
        console.error('Ошибка при входе:', error);
        alert('Неверное имя пользователя или пароль. Попробуйте снова.');
        return;
    }

    if (user) {
        // Если пользователь найден, сохраняем его ID в localStorage
        localStorage.setItem('user_id', user.id);

        alert('Вход выполнен успешно!');

        // Перенаправляем пользователя на главную страницу
        window.location.href = 'https://falsea3.github.io/rep/delta/members.html'; // Замените '/main.html' на URL вашей главной страницы
    } else {
        alert('Пользователь не найден. Проверьте ваши данные.');
    }
}

// Привязываем функцию входа к кнопке
document.getElementById('login-button').onclick = loginUser;
