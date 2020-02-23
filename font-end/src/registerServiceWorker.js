import feature from 'feature.js';

(() => {
  // TODO add service worker code here
  if (feature.serviceWorker) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
      .register('service-worker.js', {scope: '/'})
      .then(function () { window.console.log('Service Worker Registered') });
    });
  }
})();