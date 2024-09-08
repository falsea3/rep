document.addEventListener("DOMContentLoaded", function() {
    var loader = document.getElementById("loader");

    loader.style.display = "flex";

    var minLoadingTime = 1000;
    var startTime = Date.now();

    function hideLoader() {
        var elapsedTime = Date.now() - startTime;
        var remainingTime = minLoadingTime - elapsedTime;

        if (remainingTime > 0) {
            setTimeout(function() {
                loader.style.display = "none";
            }, remainingTime);
        } else {
            loader.style.display = "none";
        }
    }

    window.onload = hideLoader;
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

// Получаем ID из URL
const filmId = getParameterByName('id');

// Определяем API-ключ и базовый URL для запросов
const apiKey = 'cf6241dc-4494-40c3-9c39-f313d7f159f6';
const baseUrl = `https://kinopoiskapiunofficial.tech/api/v2.2/films/${filmId}`;

let sequelsAndPrequelsIds = []; // Массив для хранения ID сиквелов и приквелов

// Функция для получения данных о фильме
function fetchFilmDetails() {
    fetch(baseUrl, {
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
        // console.log('Response from Kinopoisk API:', data);

        const { description, coverUrl, posterUrl, logoUrl, nameRu, nameOriginal, year, ratingKinopoisk } = data;
        const title = nameRu || nameOriginal;

        const filmImage = document.getElementById('film__start-img');
        filmImage.src = coverUrl || posterUrl;

        document.title = `${title} — Kinobox`;

        document.querySelectorAll('.favorite-btn').forEach(button => {
            button.setAttribute('data-film-id', filmId);
            button.setAttribute('data-title', title);
            button.setAttribute('data-poster-url', posterUrl);
        })


        const logoElement = document.getElementById('film__start-logo');
        const titleElement = document.getElementById('film__start-title');

        if (logoUrl) {
            logoElement.src = logoUrl;
            logoElement.style.display = 'block';
            titleElement.style.display = 'none';
        } else {
            logoElement.style.display = 'none';
            titleElement.textContent = title || 'Название фильма не указано';
            titleElement.style.display = 'block';
        }

        document.getElementById('film__start-year').textContent = year || 'Год не указан';
        document.getElementById('film__start-rating').textContent = ratingKinopoisk || 'Нет рейтинга';
        document.getElementById('film__start-description').textContent = description || 'Описание отсутствует';
        document.getElementById('film__start-link').href = `player?id=${filmId}`;
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

// похожие
async function fetchSimilarFilms() {
    const url = `${baseUrl}/similars`;

    try {
        // console.log(`Fetching similar films from: ${url}`);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-API-KEY': apiKey
            }
        });

        if (!response.ok) {
            throw new Error(`Ошибка сети: ${response.status}`);
        }

        const data = await response.json();
        // console.log('Similar films data:', data);

        // Фильтрация похожих фильмов, чтобы исключить сиквелы и приквелы
        const filteredFilms = data.items.filter(film => !sequelsAndPrequelsIds.includes(film.filmId));

        displaySimilarFilms(filteredFilms);
    } catch (error) {
        console.error('Ошибка при получении похожих фильмов:', error);
    }
}

// сиквелы
async function fetchSequelsAndPrequels() {
    const url = `https://kinopoiskapiunofficial.tech/api/v2.1/films/${filmId}/sequels_and_prequels`;

    try {
        // console.log(`Fetching sequels and prequels from: ${url}`);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-API-KEY': apiKey
            }
        });

        if (!response.ok) {
            throw new Error(`Ошибка сети: ${response.status}`);
        }

        const data = await response.json();
        // console.log('Sequels and Prequels data:', data);

        // Сохраняем ID всех приквелов и сиквелов
        sequelsAndPrequelsIds = data.map(film => film.filmId);

        displaySequelsAndPrequels(data);
    } catch (error) {
        console.error('Ошибка при получении приквелов и сиквелов:', error);
    }
}

// отображение похожих
function displaySimilarFilms(films) {
    const filmMoreSection = document.querySelector('.films__list');

    if (!filmMoreSection) return;

    if (films.length === 0) {
        filmMoreSection.innerHTML += '<p>Похожих фильмов пока нет.</p>';
        return;
    }

    films.forEach(film => {
        const filmElement = document.createElement('div');
        filmElement.className = 'film';

        const filmLink = document.createElement('a');
        filmLink.href = `film?id=${film.filmId}`;
        filmLink.innerHTML = `
            <img src="${film.posterUrl}" alt="${film.nameRu}" />
            <p>${film.nameRu}</p>
        `;
        
        const filmElementFavorite = document.createElement('div');
        filmElementFavorite.className = 'film__favorite';
        filmElementFavorite.innerHTML = `
            <button class="favorite-btn"
                data-film-id="${film.filmId}" 
                data-title="${film.nameRu}" 
                data-poster-url="${film.posterUrl}">
                    <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 7H26C28.7614 7 31 9.23858 31 12V31.0567C31 32.8095 28.9056 33.7144 27.6293 32.5131L23.0561 28.209C21.9009 27.1218 20.0991 27.1218 18.9439 28.209L14.3707 32.5131C13.0944 33.7144 11 32.8095 11 31.0567V12C11 9.23858 13.2386 7 16 7Z" stroke="#808080" stroke-width="2"/>
                    </svg>
            </button>
        `;
        filmElement.appendChild(filmLink);
        filmElement.appendChild(filmElementFavorite);
    
        filmMoreSection.appendChild(filmElement);
    });
}

// Приквылы и сиквелы
function displaySequelsAndPrequels(films) {
    const sequelsSection = document.querySelector('.sequels__list');

    if (!sequelsSection) return;

    if (films.length === 0) {
        sequelsSection.innerHTML += '<p>Приквелов и сиквелов пока нет.</p>';
        return;
    }

    films.forEach(film => {
        const filmElement = document.createElement('div');
        filmElement.className = 'film';

        const filmLink = document.createElement('a');
        filmLink.href = `film?id=${film.filmId}`;
        filmLink.innerHTML = `
            <img src="${film.posterUrl}" alt="${film.nameRu}" />
            <p>${film.nameRu}</p>
        `;
        
        const filmElementFavorite = document.createElement('div');
        filmElementFavorite.className = 'film__favorite';
        filmElementFavorite.innerHTML = `
            <button class="favorite-btn"
                data-film-id="${film.filmId}" 
                data-title="${film.nameRu}" 
                data-poster-url="${film.posterUrl}">
                    <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 7H26C28.7614 7 31 9.23858 31 12V31.0567C31 32.8095 28.9056 33.7144 27.6293 32.5131L23.0561 28.209C21.9009 27.1218 20.0991 27.1218 18.9439 28.209L14.3707 32.5131C13.0944 33.7144 11 32.8095 11 31.0567V12C11 9.23858 13.2386 7 16 7Z" stroke="#808080" stroke-width="2"/>
                    </svg>
            </button>
        `;
        filmElement.appendChild(filmLink);
        filmElement.appendChild(filmElementFavorite);
        sequelsSection.appendChild(filmElement);
    
    });
}

if (filmId) {
    fetchFilmDetails();
    fetchSequelsAndPrequels().then(fetchSimilarFilms); 
} else {
    console.error('ID фильма не найден в URL');
}
