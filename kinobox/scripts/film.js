
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

function displayFilms(films, sectionSelector, emptyMessage) {
    const section = document.querySelector(sectionSelector);

    if (!section) return;

    if (films.length === 0) {
        section.innerHTML += `<p>${emptyMessage}</p>`;
        return;
    }

    films.forEach(film => {
        const filmElement = createFilmElement(film);
        section.appendChild(filmElement);
    });
}

function displaySimilarFilms(films) {
    displayFilms(films, '.films__list', 'Похожих фильмов пока нет.');
}

function displaySequelsAndPrequels(films) {
    displayFilms(films, '.sequels__list', 'Приквелов и сиквелов пока нет.');
}

if (filmId) {
    fetchFilmDetails();
    fetchSequelsAndPrequels().then(fetchSimilarFilms).then(() => initializeFavoriteButtons()); 
} else {
    console.error('ID фильма не найден в URL');
}
