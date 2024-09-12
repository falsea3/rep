document.addEventListener('DOMContentLoaded', () => {
    fetch('https://kinobox.tv/api/films/popular')
        .then(response => response.json())
        .then(data => {
            console.log(data);

            if (Array.isArray(data)) {
                const films = data;
                const container = document.getElementById('films__list');

                films.forEach(film => {
                    const filmElement = createFilmElement(film);
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
