const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
}

// Переключаем тему и сохраняем выбор
function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
}

document.querySelector('.theme-toggle-btn').addEventListener('click', toggleTheme);