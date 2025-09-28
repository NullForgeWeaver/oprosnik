/**
 * parser.js - Минимальный и безопасный парсер для страниц Finesse
 */

(function () {
  // Работать только во вкладке верхнего уровня (не во фреймах)
  if (window.top !== window) return;

  function createIndicator() {
    // Защита от дублирования индикатора
    if (document.getElementById('oprosnik-indicator')) return;

    const indicator = document.createElement('div');
    indicator.id = 'oprosnik-indicator';
    indicator.style.cssText = `
      position: fixed;
      bottom: 10px;
      right: 10px;
      background: #4CAF50;
      color: white;
      padding: 5px 10px;
      border-radius: 3px;
      font-size: 12px;
      z-index: 99999;
      opacity: 0.8;
      pointer-events: none;
    `;
    indicator.textContent = '✓ Oprosnik Helper';

    // Если body еще недоступен, дождемся DOMContentLoaded
    if (!document.body) {
      document.addEventListener('DOMContentLoaded', () => {
        if (!document.getElementById('oprosnik-indicator')) {
          document.body.appendChild(indicator);
          setTimeout(() => indicator.remove(), 3000);
        }
      }, { once: true });
    } else {
      document.body.appendChild(indicator);
      setTimeout(() => indicator.remove(), 3000);
    }
  }

  // Обработчик сообщений от background
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request && request.action === 'ping') {
      sendResponse({
        status: 'pong',
        message: 'Parser активен',
        url: window.location.href
      });
      // Возвращать true не нужно, ответ уже отправлен синхронно
    }
  });

  // Инициализация при загрузке
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createIndicator, { once: true });
  } else {
    createIndicator();
  }
})();