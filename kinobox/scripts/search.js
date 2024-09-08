const apiKey = 'cf6241dc-4494-40c3-9c39-f313d7f159f6';
        let searchForm = document.getElementById('search-form');
        let searchInput = document.getElementById('search-input');
        let resultsContainer = document.getElementById('films__list');

        searchForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const keyword = searchInput.value;
            searchMovies(keyword);
        });

        function getParameterByName(name) {
            const url = window.location.href;
            const nameRegex = name.replace(/[\[\]]/g, '\\$&');
            const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
            const results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, ' '));
            
        }

        function searchMovies(keyword) {
            const apiUrl = `https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=${keyword}&page=1`;
            document.title = keyword + ' — Kinobox';
            fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-API-KEY': apiKey
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                displayResults(data.films);
                initializeFavoriteButtons();
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
        }

        function displayResults(films) {
            resultsContainer.innerHTML = '';
            
            if (films.length === 0) {
                resultsContainer.innerHTML = '<p>Результатов поиска не найдено</p>';
                return;
            }
            
            films.forEach(film => {
                const name = film.nameRu || film.nameEn || film.nameOriginal; 
        
                if (!name) {
                    return;
                }
        
                // Основной контейнер для фильма
                const filmElement = document.createElement('div');
                filmElement.className = 'film';
        
                // Ссылка на фильм
                const filmLink = document.createElement('a');
                filmLink.href = `film?id=${film.filmId}`;
                filmLink.className = 'film__link';
                filmLink.innerHTML = `
                    <img src="${film.posterUrlPreview || 'default-poster.jpg'}" alt="${name}">
                    <p>${name}</p>
                    <p class="film__year">${film.year || 'No year'}</p>
                    <p class="film__rating">${film.rating || ''}</p>
                `;
        
                // Кнопка для добавления в избранное
                const filmElementFavorite = document.createElement('div');
                filmElementFavorite.className = 'film__favorite';
                filmElementFavorite.innerHTML = `
                    <button class="favorite-btn"
                        data-film-id="${film.filmId}" 
                        data-title="${name}" 
                        data-poster-url="${film.posterUrlPreview || 'default-poster.jpg'}">
                        <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 7H26C28.7614 7 31 9.23858 31 12V31.0567C31 32.8095 28.9056 33.7144 27.6293 32.5131L23.0561 28.209C21.9009 27.1218 20.0991 27.1218 18.9439 28.209L14.3707 32.5131C13.0944 33.7144 11 32.8095 11 31.0567V12C11 9.23858 13.2386 7 16 7Z" stroke="#808080" stroke-width="2"/>
                        </svg>
                    </button>
                `;
        
                // Собираем все элементы в один контейнер
                filmElement.appendChild(filmLink);
                filmElement.appendChild(filmElementFavorite);
        
                // Добавляем элемент фильма в контейнер результатов поиска
                resultsContainer.appendChild(filmElement);
        
                // Обновляем цвет фона для рейтинга
                const ratingElement = filmElement.querySelector('.film__rating');
                const ratingValue = parseFloat(film.rating);
        
                if (!isNaN(ratingValue)) {
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
                
            });
        }
        
        // поиск при загрузке страницы
        // document.addEventListener('DOMContentLoaded', () => {
        //     const searchParam = getParameterByName('search');
        //     if (searchParam) {
        //         searchInput.value = searchParam;
        //         searchMovies(searchParam);
        //     }
        // });