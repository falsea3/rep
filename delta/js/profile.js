async function loadUserProfile() {
    const urlParams = new URLSearchParams(window.location.search);
    const userIdFromUrl = urlParams.get('id');  // Проверяем параметр id в URL
    const userId = userIdFromUrl || localStorage.getItem('user_id');  // Если в URL нет id, берем из localStorage

    if (!userId) {
        alert('ID пользователя не найден. Пожалуйста, войдите в систему.');
        window.location.href = 'https://falsea3.github.io/rep/delta/login';  // Перенаправляем на страницу логина, если нет user_id
        return;
    }

    try { 
        // Выполняем запрос к базе данных, чтобы получить информацию о пользователе
        const { data: user, error } = await _supabase
            .from('users')
            .select('id, username, role, position, created_at, status') // Добавляем поле status
            .eq('id', userId);  // Используем полученный ID (из URL или localStorage)
    
        if (error || !user || user.length === 0) {
            console.error('Ошибка при получении информации о пользователе:', error);
            alert('Не удалось загрузить данные пользователя.');
            return;
        }
    
        // В данном случае user - массив, берем первый элемент
        const userInfo = user[0];

        // Проверяем статус пользователя
        if (userInfo.status === 'blocked') {
            document.getElementById('status').textContent = 'Заблокирован'; // Предполагаем, что у вас есть элемент с id="status"
        } else {
            document.getElementById('status').textContent = ''; // Или другой статус, если нужно
        }
    
        // Отображаем информацию о пользователе
        document.getElementById('username').textContent = userInfo.username;
        document.getElementById('position').textContent = userInfo.position;
    
        // Форматирование даты создания пользователя
        const createdAt = new Date(userInfo.created_at);
        const options = { day: 'numeric', month: 'long', year: '2-digit' };  // Формат: 12 мая 24 г.
        const formattedDate = createdAt.toLocaleDateString('ru-RU', options);
        document.getElementById('createdat').textContent = formattedDate;
    
        // Вставка первой буквы имени пользователя в элемент с id=user-img
        const userInitial = userInfo.username.charAt(0).toUpperCase();
        document.getElementById('user-img').textContent = userInitial;
    
    } catch (err) {
        console.error('Ошибка при выполнении запроса:', err);
    }
}

// Вызов функции при загрузке страницы
loadUserProfile();
