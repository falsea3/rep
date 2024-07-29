const themeToggleButton = document.getElementById('theme-toggle');
const body = document.body;

// Function to toggle theme
function toggleTheme() {
    body.classList.toggle('dark');
    const theme = body.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
}

// Event listener for theme toggle button
themeToggleButton.addEventListener('click', toggleTheme);

// Initialize theme based on localStorage
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark');
    }
});

// document.addEventListener('DOMContentLoaded', function() {
//     const grids = document.querySelectorAll('.grid');
//     grids.forEach(grid => {
//         const lists = grid.querySelectorAll('ol');
//         lists.forEach((list, index) => {
//             const prefix = (index + 1);
//             list.querySelectorAll('li').forEach(item => {
//                 item.setAttribute('data-prefix', prefix);
//             });
//             list.style.counterReset = 'subitem';
//         });
//     });
// });