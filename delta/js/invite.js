async function createInvite() {
    const username = document.getElementById('invite-username').value;
    const role = document.getElementById('invite-role').value;
    const position = document.getElementById('invite-position').value;

    // Получаем user_id из localStorage
    const userId = localStorage.getItem('user_id');

    // Проверяем, что userId существует
    if (!userId) {
        alert('Вы не авторизованы. Пожалуйста, войдите в систему.');
        return;
    }

    // Получаем информацию о текущем пользователе
    const { data: user, error: userError } = await _supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single(); // Получаем только одного пользователя

    if (userError) {
        console.error('Ошибка при получении информации о пользователе:', userError);
        return;
    }

    // Проверяем, что роль пользователя - директор
    if (user.role !== 'director') {
        alert('Только директор может отправлять приглашения.');
        return; // Прерываем выполнение, если роль не директор
    }

    // Генерируем уникальный токен для ссылки приглашения
    const inviteToken = generateInviteToken();

    // Сохраняем приглашение в базу данных с указанием статуса "pending"
    const { data, error } = await _supabase
        .from('invites')
        .insert([{ username, role, position, token: inviteToken, status: 'pending' }]);

    if (error) {
        console.error('Ошибка при создании приглашения:', error);
        return;
    }

    // Создаем ссылку для приглашения
    const inviteLink = `https://falsea3.github.io/rep/delta/register?token=${inviteToken}`;
    document.getElementById('invite-url').href = inviteLink;
    document.getElementById('invite-url').textContent = inviteLink;
    document.getElementById('invite-link').style.display = 'block';
}

// Генерация токена для уникальной ссылки
function generateInviteToken() {
    return Math.random().toString(36).substr(2, 9); // Простая генерация случайного токена
}
