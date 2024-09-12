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

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/rep/kinobox/service-worker.js').then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      }).catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
    });
  }

function updateMenuState(isOpen) {
    localStorage.setItem('menuState', isOpen ? 'open' : 'closed');
}

function toggleMenu() {
    let mainContainer = document.querySelectorAll('main');
    let asideSpan = document.querySelectorAll('span');
    let asideContainer = document.querySelector('aside');
    let toggleButton = document.querySelector('.toggle-button__icon');

    toggleButton.style.transform = (toggleButton.style.transform === 'rotate(180deg)') ? 'rotate(0deg)' : 'rotate(180deg)';
    mainContainer.forEach(element => {
        element.classList.toggle('menu-open');
    });

    asideContainer.classList.toggle('aside-full');

    asideSpan.forEach(element => {
        element.style.display = (element.style.display === 'block') ? 'none' : 'block';
    });

    updateMenuState(asideContainer.classList.contains('aside-full'));
}

window.addEventListener('DOMContentLoaded', () => {
    const menuState = localStorage.getItem('menuState');

    if (menuState === 'open') {
        let mainContainer = document.querySelectorAll('main');
        let asideSpan = document.querySelectorAll('span');
        let asideContainer = document.querySelector('aside');
        document.querySelector('.toggle-button__icon').style.transform = 'rotate(180deg)';

        mainContainer.forEach(element => {
            element.classList.add('menu-open');
        });

        asideContainer.classList.add('aside-full');

        asideSpan.forEach(element => {
            element.style.display = 'block';
        });
    }
});

document.querySelector('.toggle-button').addEventListener('click', toggleMenu);


// Подключение к Supabase
const SUPABASE_URL = 'https://aayoyocdmsvuvhzirshv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFheW95b2NkbXN2dXZoemlyc2h2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU3MDgzOTUsImV4cCI6MjA0MTI4NDM5NX0.0tSpB1TlZUy7adWAd1isMxlxkz34QGKY65mYRn9P-ig';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Проверяем наличие токена в localStorage при загрузке страницы
const userToken = localStorage.getItem('user_token');

// Функция для запроса токена через диалоговое окно
function requestUserToken() {
    const token = prompt('Введите ваш токен:');
    if (token) {
        localStorage.setItem('user_token', token);
        userToken = token;
        console.log('Токен пользователя сохранён:', token);

        // Инициализируем кнопки заново с новым токеном
        updateFavoriteButtonStates();
    } else {
        console.error('Токен не введён.');
    }
}

// Основная функция для инициализации кнопок закладок
function initializeFavoriteButtons() {
    console.log('Инициализация кнопок закладок...');
    // Обновляем состояние кнопок при загрузке страницы
    updateFavoriteButtonStates();

    // Устанавливаем обработчики кликов на кнопки
    setupFavoriteButtonHandlers();
}

// Функция для обновления состояния кнопок
async function updateFavoriteButtonStates() {
    // console.log('Обновление состояния кнопок...');

    // Проверяем, существует ли токен пользователя
    if (!userToken) {
        console.error('Токен отсутствует. Обновление кнопок невозможно.');
        return;
    }

    // Запрашиваем сохраненные фильмы из базы данных
    const { data: savedFilms, error: fetchError } = await _supabase
        .from('favorites')
        .select('filmId')
        .eq('user_token', userToken);
    if (fetchError) {
        console.error('Ошибка при получении сохраненных фильмов из базы данных:', fetchError);
        return;
    }

    // console.log('Сохранённые фильмы:', savedFilms);

    // Если данные загружены, обновляем состояние кнопок
    if (savedFilms && savedFilms.length > 0) {
    document.querySelectorAll('.favorite-btn').forEach(button => {
        const filmId = button.dataset.filmId;
        const filmIdNumber = Number(filmId);
        // console.log(Проверяем фильм с ID: ${filmId} (приведённый к числу: ${filmIdNumber}));

        // Проверяем, есть ли этот фильм в базе данных
        const isFavorite = savedFilms.some(film => film.filmId === filmIdNumber);

        // console.log(Фильм ${filmId}: ${isFavorite ? 'в избранном' : 'не в избранном'});
        isFavorite ? (button.classList.add('filled'),button.classList.remove('outline')):(button.classList.add('outline'),button.classList.remove('filled'))
            
            });
        } else {
    console.log("Фильмы не найдены в базе данных.");
}
}

// Функция для установки обработчиков кликов на кнопки
function setupFavoriteButtonHandlers() {
    document.querySelectorAll('.favorite-btn').forEach(button => {
        button.addEventListener('click', async function () {
            this.classList.toggle('filled') || this.classList.toggle('outline');
            const filmId = this.dataset.filmId;
            const title = this.dataset.title;
            const posterUrl = this.dataset.posterUrl;
            const filmIdNumber = Number(filmId);

            if (!userToken) {
                window.location.href = 'profile.html';
                console.error('Токен отсутствует. Невозможно выполнить операцию.');
                return;
            }

            // console.log(`Нажата кнопка для фильма с ID: ${filmId}`);

            // Проверяем, есть ли этот фильм в базе
            const { data: existingFilm, error: fetchError } = await _supabase
                .from('favorites')
                .select('filmId')
                .eq('user_token', userToken)
                .eq('filmId', filmIdNumber) 
                .maybeSingle();

            if (fetchError) {
                console.error('Ошибка при проверке фильма в базе данных:', fetchError);
                return;
            }

            if (existingFilm) {
                const { error: deleteError } = await _supabase
                    .from('favorites')
                    .delete()
                    .eq('user_token', userToken)
                    .eq('filmId', filmIdNumber);

                if (deleteError) {
                    console.error('Ошибка при удалении фильма из базы данных:', deleteError);
                } else {
                    console.log('Фильм успешно удален из базы данных');
                }
            } else {
                console.log(`Фильм с ID ${filmId} отсутствует в базе. Добавляем...`);
                // Если фильма нет в избранном, добавляем его
                const { error: insertError } = await _supabase
                    .from('favorites')
                    .insert([
                        {
                            user_token: userToken,
                            filmId: filmIdNumber, // Сохраняем числовое значение filmId
                            title: title,
                            filmImage: posterUrl
                        }
                    ]);

                if (insertError) {
                    console.error('Ошибка при сохранении фильма в базу данных:', insertError);
                }
            }
        });
    });
}

function createFilmElement(film) {
    const filmElement = document.createElement('div');
    filmElement.className = 'film';

    const filmLink = document.createElement('a');
    filmLink.href = `/film?id=${film.filmId}`;
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

    return filmElement;
}

const authButtons = document.querySelectorAll('.auth-btn');
authButtons.forEach(button => {
    button.addEventListener('click', () => {
        window.location.href = 'profile.html';
    });
});
