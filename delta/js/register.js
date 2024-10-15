// Проверка токена приглашения и отображение формы регистрации
async function checkInviteToken() {
    const urlParams = new URLSearchParams(window.location.search);
    const inviteToken = urlParams.get('token');

    if (inviteToken) {
        const { data: invites, error } = await _supabase
            .from('invites')
            .select('*')
            .eq('token', inviteToken)
            .eq('status', 'pending'); // Проверяем, что приглашение еще активно

        if (error || invites.length === 0) {
            console.error('Ошибка: приглашение недействительно.');
            return;
        }

        const invite = invites[0];
        document.getElementById('register-username').textContent = invite.username;
        document.getElementById('registration-form').style.display = 'block';
    }
}

// Завершение регистрации пользователя
async function completeRegistration() {
    const password = document.getElementById('register-password').value;
    const urlParams = new URLSearchParams(window.location.search);
    const inviteToken = urlParams.get('token');

    const { data: invites, error } = await _supabase
        .from('invites')
        .select('*')
        .eq('token', inviteToken);

    if (error || invites.length === 0) {
        console.error('Ошибка при завершении регистрации');
        return;
    }

    const invite = invites[0];

    // Сохраняем нового пользователя в таблицу `users`
    const { data: newUser, error: userError } = await _supabase
        .from('users')
        .insert([{ 
            username: invite.username, 
            role: invite.role, 
            position: invite.position, 
            password 
        }]);

    if (userError) {
        console.error('Ошибка при создании пользователя:', userError);
        return;
    }

    // Обновляем статус приглашения на "completed"
    await _supabase
        .from('invites')
        .update({ status: 'completed' })
        .eq('id', invite.id);

    alert('Регистрация успешно завершена! Теперь вы можете войти.');
    window.location.href = '/login';
}

// Вызов проверки токена при загрузке страницы регистрации
checkInviteToken();