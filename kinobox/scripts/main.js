document.addEventListener("DOMContentLoaded", function() {
    var loader = document.getElementById("loader");

    loader.style.display = "flex";

    var minLoadingTime = 2000;
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


// Настройки Supabase
// Подключение к Supabase
const SUPABASE_URL = 'https://aayoyocdmsvuvhzirshv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFheW95b2NkbXN2dXZoemlyc2h2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU3MDgzOTUsImV4cCI6MjA0MTI4NDM5NX0.0tSpB1TlZUy7adWAd1isMxlxkz34QGKY65mYRn9P-ig';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Получаем токен из localStorage (если есть

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
    console.log('Обновление состояния кнопок...');

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

    console.log('Сохранённые фильмы:', savedFilms);

    // Если данные загружены, обновляем состояние кнопок
    if (savedFilms && savedFilms.length > 0) {
        document.querySelectorAll('.favorite-btn').forEach(button => {
            const filmId = button.dataset.filmId;
            const filmIdNumber = Number(filmId); // Приводим filmId к числу для корректного сравнения
            console.log(`Проверяем фильм с ID: ${filmId} (приведённый к числу: ${filmIdNumber})`);

            // Проверяем, есть ли этот фильм в базе данных
            const isFavorite = savedFilms.some(film => film.filmId === filmIdNumber);

            console.log(`Фильм ${filmId}: ${isFavorite ? 'в избранном' : 'не в избранном'}`);

            if (isFavorite) {
                button.classList.add('filled');
                button.classList.remove('outline');
            } else {
                button.classList.add('outline');
                button.classList.remove('filled');
            }
        });
    } else {
        console.log("Фильмы не найдены в базе данных.");
    }
}

// Функция для установки обработчиков кликов на кнопки
function setupFavoriteButtonHandlers() {
    document.querySelectorAll('.favorite-btn').forEach(button => {
        button.addEventListener('click', async function () {
            const filmId = this.dataset.filmId;
            const title = this.dataset.title;
            const posterUrl = this.dataset.posterUrl;
            const filmIdNumber = Number(filmId); // Приводим filmId к числу для правильного сравнения

            if (!userToken) {
                console.error('Токен отсутствует. Невозможно выполнить операцию.');
                return;
            }

            console.log(`Нажата кнопка для фильма с ID: ${filmId}`);

            // Проверяем, есть ли этот фильм в базе
            const { data: existingFilm, error: fetchError } = await _supabase
                .from('favorites')
                .select('filmId')
                .eq('user_token', userToken)
                .eq('filmId', filmIdNumber) // Используем числовое значение filmId
                .maybeSingle();

            if (fetchError) {
                console.error('Ошибка при проверке фильма в базе данных:', fetchError);
                return;
            }

            if (existingFilm) {
                console.log(`Фильм с ID ${filmId} уже в базе. Удаляем...`);
                // Если фильм уже есть, удаляем его
                const { error: deleteError } = await _supabase
                    .from('favorites')
                    .delete()
                    .eq('user_token', userToken)
                    .eq('filmId', filmIdNumber); // Используем числовое значение filmId

                if (deleteError) {
                    console.error('Ошибка при удалении фильма из базы данных:', deleteError);
                } else {
                    this.classList.remove('filled');
                    this.classList.add('outline');
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
                } else {
                    this.classList.remove('outline');
                    this.classList.add('filled');
                    console.log('Фильм успешно добавлен в базу данных');
                }
            }
        });
    });
}

// // Если токен отсутствует, запрашиваем его у пользователя
// if (!userToken) {
//     console.log('Токен отсутствует. Запрашиваем токен...');

// } else {
//     console.log('Токен найден:', userToken);
// }

// Запуск инициализации с задержкой
setTimeout(() => {
    console.log('Запуск инициализации кнопок закладок...');
    initializeFavoriteButtons();
}, 1000); // Задержка в 1 секунду

const authButtons = document.querySelectorAll('.auth-btn');
authButtons.forEach(button => {
    button.addEventListener('click', () => {
        window.location.href = 'profile.html';
    });
});

// const authButtons = document.querySelectorAll('.auth-btn');
// authButtons.forEach(button => {
//     button.addEventListener('click', async function() {
//     // Проверяем, есть ли токен в localStorage
//     const savedToken = localStorage.getItem('user_token');
    
//     if (savedToken) {
//         // Если токен существует, перенаправляем на страницу профиля
//         window.location.href = 'profile.html';
//         return; // Останавливаем выполнение дальнейшего кода
//     }
    
//     // Получаем текст из буфера обмена
//     const clipboardText = await getClipboardText();
    
//     // Если текст из буфера обмена является валидным токеном
//     if (validateToken(clipboardText)) {
//         // Сохраняем токен в localStorage
//         localStorage.setItem('user_token', clipboardText);
//         alert(`Скопированный токен "${clipboardText}" сохранён.`);
//         return;
//     }

//     // Если токен не скопирован или не валиден, открываем бота для получения токена
//     window.open('https://t.me/kinoboxauth_bot', '_blank');

//     // Запрашиваем ввод токена у пользователя
//     const userToken = prompt('Введите ваш токен:');

//     // Если введённый токен валиден, сохраняем его в localStorage
//     if (validateToken(userToken)) {
//         localStorage.setItem('user_token', userToken);
//         alert(`Токен "${userToken}" сохранён.`);
//     } else {
//         // Если токен не валиден, показываем сообщение об ошибке
//         alert('Неверный токен. Попробуйте ещё раз.');
//     }
// });
// });

// // Функция проверки токена на валидность
// function validateToken(token) {
//     const tokenRegex = /^[A-Za-z0-9]{5}-[A-Za-z0-9]{5}-[A-Za-z0-9]{5}$/;
//     return tokenRegex.test(token);
// }

// // Функция для получения текста из буфера обмена
// async function getClipboardText() {
//     try {
//         const clipboardText = await navigator.clipboard.readText();
//         return clipboardText;
//     } catch (err) {
//         console.error('Не удалось получить текст из буфера обмена', err);
//         return '';
//     }
// }
