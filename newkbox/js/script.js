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
    navigator.registerProtocolHandler('web+kinobox', '/rep/newkbox/', 'Kinobox');
    navigator.registerProtocolHandler('web+kinoboxsearch', '/rep/newkbox/search?search=%s', 'Kinobox Search');
    navigator.registerProtocolHandler('web+kinoboxfilm', '/rep/newkbox/film?id=%s', 'Kinobox Film');
}
window.onload = function() {
  const path = window.location.pathname;

  if (path.includes('film=')) {
      const filmId = path.split('film=')[1];
      window.location.href = `/rep/newkbox/film?id=${filmId}`;
  } else if (path.includes('s=')) {
      const searchQuery = path.split('s=')[1];
      window.location.href = `/rep/newkbox/search?search=${searchQuery}`;
  } else {
      window.location.href = '/rep/newkbox/';  // На главную страницу, если ничего не найдено
  }
};
