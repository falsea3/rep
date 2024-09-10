document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('user_token');
    const tokenInputSection = document.getElementById('tokenInputSection');
    const profileSection = document.getElementById('profileSection');
    const userName = document.getElementById('userName');
    // const userAvatar = document.getElementById('userAvatar');
    const userRegistrationDate = document.getElementById('userRegistrationDate');
    const userTokenInput = document.getElementById('userTokenInput');
    const toggleTokenVisibility = document.getElementById('toggleTokenVisibility');

    let tokenVisible = false;

    // Проверяем наличие токена в localStorage и показываем соответствующий интерфейс
    if (token) {
        // Если токен есть, прячем ввод токена и загружаем профиль
        tokenInputSection.style.display = 'none';
        profileSection.style.display = 'flex';
        fetchUserProfile(token);
    } else {
        // Если токена нет, показываем поле для ввода токена
        tokenInputSection.style.display = 'flex';
        profileSection.style.display = 'none';
    }

    // При отправке токена сохраняем его и загружаем профиль
    document.getElementById('submitToken').addEventListener('click', () => {
        const inputToken = document.getElementById('tokenInput').value;
        if (inputToken) {
            localStorage.setItem('user_token', inputToken);
            fetchUserProfile(inputToken);

            // Скрываем поле ввода токена, показываем профиль
            tokenInputSection.style.display = 'none';
            profileSection.style.display = 'flex';
        }
    });

    // Смена токена: удаляем токен из localStorage и показываем поле для его ввода
    document.getElementById('changeToken').addEventListener('click', () => {
        localStorage.removeItem('user_token');
        profileSection.style.display = 'none';
        tokenInputSection.style.display = 'flex';
    });

    // Переключение видимости токена
    toggleTokenVisibility.addEventListener('click', () => {
        tokenVisible = !tokenVisible;
        if (tokenVisible) {
            userTokenInput.value = token;
            toggleTokenVisibility.textContent = '🙈';  // Скрыть
        } else {
            userTokenInput.value = maskToken(token);
            toggleTokenVisibility.textContent = '👁️';  // Показать
        }
    });

    // Функция для загрузки профиля пользователя
    async function fetchUserProfile(token) {
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/users?user_token=eq.${token}`, {
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json',
                },
            });

            const userData = await response.json();

            if (userData && userData.length > 0) {
                const user = userData[0];

                // Заполняем данные профиля
                userName.textContent = user.first_name;
                // userAvatar.src = user.avatar_url;
                userRegistrationDate.textContent = new Date(user.registration_date).toLocaleDateString();

                // Маскируем токен
                userTokenInput.value = maskToken(token);
            } else {
                throw new Error('Пользователь не найден');
            }
        } catch (error) {
            alert('Ошибка получения данных пользователя: ' + error.message);
            console.error('Ошибка:', error);
        }
    }

    // Функция маскировки токена
    function maskToken(token) {
        return token.replace(/./g, (char, index) => (index % 6 === 5) ? '-' : '*').slice(0, 17);
    }
});
