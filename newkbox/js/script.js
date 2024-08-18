window.addEventListener('DOMContentLoaded', (event) => {
  const hash = window.location.hash.substring(1);
  
  // Если hash содержит закодированный протокол web+kinobox
  if (hash.startsWith('web%2Bkinobox')) {
      const decodedHash = decodeURIComponent(hash); // Декодируем хэш
      const urlParts = decodedHash.split('//'); // Разделяем URL
      
      if (urlParts.length > 1) {
          const query = urlParts[1]; // Извлекаем часть после //
          
          if (query.startsWith('film=')) {
              const filmId = query.substring(5); // Извлекаем ID фильма
              window.location.href = `/rep/newkbox/film?id=${filmId}`; // Перенаправляем
          } else if (query.startsWith('search=')) {
              const searchQuery = query.substring(7); // Извлекаем запрос поиска
              window.location.href = `/rep/newkbox/search?search=${searchQuery}`; // Перенаправляем
          } else {
              window.location.href = '/rep/newkbox/'; // Перенаправляем на главную страницу
          }
      }
  }
});
window.onload = function() {
  const loader = document.getElementById('loader');
  if (loader && content) {
    const loader = document.getElementById('loader');
    loader.style.display = 'none';
  } else {
    console.error('DOM elements not found: loader or content');
  }
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

  // window.addEventListener('beforeinstallprompt', (e) => {
  //   // Предотвращаем показ нативного диалога
  //   e.preventDefault();
  //   // Сохраняем событие для последующего вызова
  //   deferredPrompt = e;
  
  //   // Показываем кастомный элемент интерфейса (например, кнопку)
  //   const installButton = document.getElementById('installButton');
  //   installButton.style.display = 'block';
  
  //   installButton.addEventListener('click', () => {
  //     // Скрываем кастомный элемент интерфейса
  //     installButton.style.display = 'none';
  //     // Показываем нативный диалог установки
  //     deferredPrompt.prompt();
  //     // Ждем ответа пользователя
  //     deferredPrompt.userChoice.then((choiceResult) => {
  //       if (choiceResult.outcome === 'accepted') {
  //         console.log('User accepted the install prompt');
  //       } else {
  //         console.log('User dismissed the install prompt');
  //       }
  //       deferredPrompt = null;
  //     });
  //   });
  // });

  if (navigator.registerProtocolHandler) {
    navigator.registerProtocolHandler('web+kinobox', '/rep/newkbox/#%s', 'Kinobox');
}

