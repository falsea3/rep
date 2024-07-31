function closeInstruction() {
    document.getElementById('instruction').style.display = 'none';
    localStorage.setItem('instructionShown', 'true');
}

document.addEventListener('DOMContentLoaded', function() {
    var instruction = document.getElementById('instruction');
    var instructionShown = localStorage.getItem('instructionShown');

    if (!instructionShown) {
        var input = document.querySelector('input');
        input.addEventListener('focusin', function(event) {
            if (event.target.closest('input') === input) {
                instruction.style.display = 'block';
            }
        });

        input.addEventListener('focusout', function(event) {
            if (!event.target.closest('input') === input) {
                instruction.style.display = 'none';
            }
        });
    }

    // Показать историю поиска
    showSearchHistory();
});

window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('kinopoisk');
    if (movieId) {
        kbox('.kinobox_player', {search: {kinopoisk: movieId}});
    } else {
        document.getElementById('searchContainer').style.display = 'flex';
    }
}

function searchMovie() {
    const title = document.getElementById('title').value;

    // Добавить в историю поиска
    addSearchHistory(title);

    // Выполнить поиск фильма
    kbox('.kinobox_player', {search: {query: title}});
    document.getElementById('player').scrollIntoView({ behavior: 'smooth' });
}

function addSearchHistory(query) {
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!history.includes(query)) {
        // Добавить новый элемент в начало массива
        history.unshift(query);
        // Ограничить длину массива до 4 элементов
        history = history.slice(0, 4);
        localStorage.setItem('searchHistory', JSON.stringify(history));
        showSearchHistory();
    }
}

function showHistory() {
const history = document.getElementById('history');
history.classList.add('active');
showSearchHistory();
}

function hideHistory() {
const history = document.getElementById('history');
history.classList.remove('active');
}

document.addEventListener('DOMContentLoaded', function() {
const input = document.getElementById('title');

input.addEventListener('focus', function() {
showHistory();
});

input.addEventListener('blur', function() {
hideHistory();
});
});

function showSearchHistory() {
let historyList = document.getElementById('historyList');
historyList.innerHTML = '';

let history = JSON.parse(localStorage.getItem('searchHistory')) || [];

history.forEach(item => {
let li = document.createElement('li');
li.textContent = item;
li.addEventListener('click', function() {
    document.getElementById('title').value = item;
    searchMovie();
});
historyList.appendChild(li);
});

// if (history.length > 0) {
//     document.getElementById('history').style.display = 'none';
// } else {
//     document.getElementById('history').style.display = 'none';
// }
}