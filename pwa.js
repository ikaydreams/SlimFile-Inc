// Register Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(reg => console.log('✅ Service Worker registered'))
    .catch(err => console.error('❌ Service Worker registration failed:', err));
}

// Handle Install Prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  const installBtn = document.getElementById('installBtn');
  if (installBtn) {
    installBtn.style.display = 'inline-block';

    installBtn.addEventListener('click', () => {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('🎉 User accepted the install prompt');
        } else {
          console.log('🙅 User dismissed the install prompt');
        }
        deferredPrompt = null;
        installBtn.style.display = 'none';
      });
    });
  }
});
