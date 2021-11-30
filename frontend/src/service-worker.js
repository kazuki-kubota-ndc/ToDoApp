//eslint-disable-next-line
self.addEventListener('install', () => {
  console.log('[sw]', 'Your ServiceWorker is installed');
});

//eslint-disable-next-line
self.addEventListener('push', ev => {
  console.log('[sw]', 'pushed!!', ev.data.json());
  const {title, msg, icon} = ev.data.json();
  //eslint-disable-next-line
  self.registration.showNotification(title, {
    body: msg,
    icon: icon,
  });
});
