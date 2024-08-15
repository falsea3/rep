window.onload = function() {
  // Декодируем URL и убираем символ '#'
  const hash = decodeURIComponent(window.location.hash.substring(1));

  if (hash.startsWith('film?id=')) {
      const filmId = hash.split('film?id=')[1];
      window.location.href = `/rep/newkbox/film?id=${filmId}`;
  } else if (hash.startsWith('search?query=')) {
      const searchQuery = hash.split('search?query=')[1];
      window.location.href = `/rep/newkbox/search?search=${searchQuery}`;
  } else {
      window.location.href = '/rep/newkbox/';
  }
};
window.onload = function() {
    const loader = document.getElementById('loader');
    const content = document.getElementById('content');
    loader.style.display = 'none';
    content.style.display = 'block';
};

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/rep/newkbox/service-worker.js').then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      }).catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
    });
  }
  
  let deferredPrompt;

  window.addEventListener('beforeinstallprompt', (e) => {
    // Предотвращаем показ нативного диалога
    e.preventDefault();
    // Сохраняем событие для последующего вызова
    deferredPrompt = e;
  
    // Показываем кастомный элемент интерфейса (например, кнопку)
    const installButton = document.getElementById('installButton');
    installButton.style.display = 'block';
  
    installButton.addEventListener('click', () => {
      // Скрываем кастомный элемент интерфейса
      installButton.style.display = 'none';
      // Показываем нативный диалог установки
      deferredPrompt.prompt();
      // Ждем ответа пользователя
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        deferredPrompt = null;
      });
    });
  });

  if (navigator.registerProtocolHandler) {
    navigator.registerProtocolHandler('web+kinobox', '/rep/newkbox/#%s', 'Kinobox');
}

