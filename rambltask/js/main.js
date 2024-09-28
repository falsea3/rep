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

const textarea = document.getElementById('autoResizeTextarea');

textarea.addEventListener('input', function() {
    // Сбрасываем высоту на авто, чтобы динамически подстроить под контент
    this.style.height = 'auto';
    
    // Изменяем высоту, равную высоте контента
    this.style.height = this.scrollHeight + 'px';
});