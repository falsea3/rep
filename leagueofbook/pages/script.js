const articles = [
    'chto-takoe-lol.html',
    'goalrules.html',
    'kakfarmit.html',
    'kait.html',
    // добавьте остальные ссылки
  ];

  const currentPath = window.location.pathname.split('/').pop();
  const currentIndex = articles.indexOf(currentPath);

  document.getElementById('next-article').addEventListener('click', function() {
    if (currentIndex < articles.length - 1) {
      window.location.href = articles[currentIndex + 1];
    }
  });

  document.getElementById('prev-article').addEventListener('click', function() {
    if (currentIndex > 0) {
      window.location.href = articles[currentIndex - 1];
    }
  });