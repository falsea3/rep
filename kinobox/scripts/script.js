
document.addEventListener('DOMContentLoaded', () => {
    fetch('https://kinobox.tv/api/films/popular')
        .then(response => response.json())
        .then(data => {
            console.log(data);

            if (Array.isArray(data)) {
                const films = data;
                const container = document.getElementById('films__list');

                films.forEach(film => {
                    // Основной контейнер для фильма
                    const filmElement = document.createElement('div');
                    filmElement.className = 'film';

                    // Ссылка на фильм
                    const filmLink = document.createElement('a');
                    filmLink.href = `film?id=${film.id}`;
                    filmLink.innerHTML = `
                        <img src="${film.posterUrl || 'default-poster.jpg'}" alt="${film.title || 'No title'}">
                        <p>${film.title || 'No title'}</p>
                        <p class="film__rating">${film.rating !== null ? parseFloat(film.rating).toFixed(1) : 'N/A'}</p>
                        <p class="film__year">${film.year || 'No year'}</p>
                    `;

                    // Кнопка для добавления в избранное
                    const filmElementFavorite = document.createElement('div');
                    filmElementFavorite.className = 'film__favorite';
                    filmElementFavorite.innerHTML = `
                        <button class="favorite-btn"
                            data-film-id="${film.id}" 
                            data-title="${film.title || 'No title'}" 
                            data-poster-url="${film.posterUrl || 'default-poster.jpg'}">
                            <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16 7H26C28.7614 7 31 9.23858 31 12V31.0567C31 32.8095 28.9056 33.7144 27.6293 32.5131L23.0561 28.209C21.9009 27.1218 20.0991 27.1218 18.9439 28.209L14.3707 32.5131C13.0944 33.7144 11 32.8095 11 31.0567V12C11 9.23858 13.2386 7 16 7Z" stroke="#808080" stroke-width="2"/>
                            </svg>
                        </button>
                    `;

                    
                    // Собираем все элементы в один контейнер
                    filmElement.appendChild(filmLink);
                    filmElement.appendChild(filmElementFavorite);

                    // Оценка
                    const ratingElement = filmElement.querySelector('.film__rating');
                    if (film.rating !== null && !isNaN(film.rating)) {
                        const ratingValue = parseFloat(film.rating);
                        if (ratingValue >= 7) {
                            ratingElement.style.backgroundColor = '#319131';
                        } else if (ratingValue > 6) {
                            ratingElement.style.backgroundColor = '#8f6b40';
                        } else {
                            ratingElement.style.backgroundColor = '#5d3333';
                        }
                    } else {
                        ratingElement.style.display = 'none';
                    }
                    // Добавляем элемент фильма в раздел на странице
                    container.appendChild(filmElement);
                });

                // Добавляем кнопку поиска в конце списка фильмов
                let lastFilm = document.createElement('a');
                lastFilm.className = 'film--last';
                lastFilm.href = 'search.html'; 
                lastFilm.innerHTML = `
                    <p>Не нашли нужный фильм?<br>Воспользуйтесь поиском</p>
                `;
                container.appendChild(lastFilm);

            } else {
                console.error('Формат ответа не соответствует ожиданиям:', data);
            }
        })
        .then(() => initializeFavoriteButtons())
        .catch(error => console.error('Ошибка при получении популярных фильмов:', error));
});
