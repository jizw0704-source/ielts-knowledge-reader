const CACHE_PREFIX = 'ielts-knowledge-reader-';
const CACHE_NAME = `${CACHE_PREFIX}v1.0-c`;
const APP_SHELL = [
  './',
  './index.html',
  './style.css?v=20260908-v1.0-c',
  './articles.js',
  './context-vocabulary.js',
  './base-dictionary.js',
  './script.js?v=20260830-v1.0-b',
  './manifest.webmanifest',
  './assets/brand/logo-horizontal.svg',
  './assets/brand/logo-horizontal-dark.svg',
  './assets/brand/logo-mark.svg',
  './assets/brand/logo-horizontal.png',
  './assets/brand/logo-horizontal-dark.png',
  './assets/brand/logo-mark.png',
  './icons/app-icon.svg',
  './icons/apple-touch-icon.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './assets/daily-posters/dawn-valley.jpg',
  './assets/daily-posters/forest-light.jpg',
  './assets/daily-posters/moonlit-ocean.jpg',
  './assets/daily-posters/library-window.jpg',
  './assets/daily-posters/project-qr.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => Promise.all(
        cacheNames
          .filter((cacheName) => cacheName.startsWith(CACHE_PREFIX) && cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName)),
      ))
      .then(() => self.clients.claim()),
  );
});

async function fetchAndCache(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    if (request.mode === 'navigate') {
      return caches.match('./index.html');
    }

    throw error;
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const requestUrl = new URL(request.url);

  if (request.method !== 'GET' || requestUrl.origin !== self.location.origin) {
    return;
  }

  event.respondWith(fetchAndCache(request));
});
