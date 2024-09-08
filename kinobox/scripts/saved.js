async function displaySavedFilms() {
    const container = document.getElementById('films__list');
    if (!container) {
        console.error('Контейнер для сохраненных фильмов не найден');
        return;
    }

    container.innerHTML = '';

    const userToken = localStorage.getItem('user_token');
    if (!userToken) {
        container.innerHTML = '<p>Вы не авторизованы. Пожалуйста, авторизуйтесь.</p>';
        return;
    }

    try {
        // Запрашиваем сохранённые фильмы из базы
        const { data: savedFilms, error } = await _supabase
            .from('favorites')
            .select('*')
            .eq('user_token', userToken);

        if (error) {
            console.error('Ошибка при получении сохранённых фильмов:', error);
            container.innerHTML = '<p>Ошибка при загрузке сохранённых фильмов</p>';
            return;
        }

        if (savedFilms.length === 0) {
            container.innerHTML = '<p>Нет сохранённых фильмов</p>';
            return;
        }

        // Отображаем фильмы
        savedFilms.forEach(film => {
            const filmElement = document.createElement('div');
            filmElement.className = 'film';

            filmElement.innerHTML = `
                <a href="film.html?id=${film.filmId}" class="film__link">
                    <img src="${film.filmImage}" alt="${film.title}">
                    <p>${film.title}</p>
                </a>
                <button class="favorite-btn filled"
                        data-film-id="${film.filmId}" 
                        data-title="${film.title}" 
                        data-poster-url="${film.filmImage}">
                    <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 7H26C28.7614 7 31 9.23858 31 12V31.0567C31 32.8095 28.9056 33.7144 27.6293 32.5131L23.0561 28.209C21.9009 27.1218 20.0991 27.1218 18.9439 28.209L14.3707 32.5131C13.0944 33.7144 11 32.8095 11 31.0567V12C11 9.23858 13.2386 7 16 7Z" stroke="#808080" stroke-width="2"/>
                    </svg>
                </button>
            `;

            container.appendChild(filmElement);
        });

        // Устанавливаем обработчики на кнопки "Избранное"
        setupFavoriteButtonHandlers();

    } catch (error) {
        console.error('Ошибка при работе с базой данных:', error);
    }
}

document.addEventListener('DOMContentLoaded', displaySavedFilms);
