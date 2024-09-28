const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
}

function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
}

document.querySelector('.theme-toggle-btn').addEventListener('click', toggleTheme);

// Пример функции, которая удаляет скелетон и загружает контент
function loadContent() {
    document.querySelectorAll('.skeleton').forEach(skeleton => {
        skeleton.style.display = 'none'; // Скрываем скелетон
    });
    // Здесь можно загрузить реальные данные и вставить их на страницу
}

// Пример симуляции загрузки
setTimeout(loadContent, 2000); // Загрузить контент через 2 секунды
