const CACHE_NAME = 'opendevhub-cache-v1';

// Assets/routes to pre-cache on install
const PRECACHE_ASSETS = [
  '/',
  '/site.webmanifest',
  '/favicon.ico',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/apple-touch-icon.png',
  '/tools',
  '/git-cheatsheets',
  '/yaml-cheatsheets',
  '/docker-compose-cheatsheets',
  '/k8s-cheatsheets',
  '/bash-cheatsheets',
  '/security-cheatsheets',
  '/css-visual-guide',
  '/css-bezier',
  '/http-status',
  '/licenses',
  '/readme-builder',
  '/commit-builder'
];

// Install event: cache pre-defined routes
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Pre-caching core shell and developer tools');
      return Promise.allSettled(
        PRECACHE_ASSETS.map((asset) => {
          return cache.add(asset).catch((err) => {
            console.warn(`Failed to pre-cache asset: ${asset}`, err);
          });
        })
      );
    }).then(() => self.skipWaiting())
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event: serve cached content offline
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Only handle HTTP/HTTPS (ignore chrome-extension, etc.)
  if (!request.url.startsWith('http')) return;

  // Avoid caching analytics or third-party ads
  if (
    request.url.includes('google-analytics') ||
    request.url.includes('doubleclick') ||
    request.url.includes('adsbygoogle') ||
    request.url.includes('vercel')
  ) {
    return;
  }

  // Check if this is a static asset (JS, CSS, images, WebP, etc.)
  const isStaticAsset =
    request.url.includes('/_next/static/') ||
    request.url.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|otf|json)$/);

  if (isStaticAsset) {
    // Cache-First Strategy for static files
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
          return networkResponse;
        }).catch(() => {
          // Offline fallback
          return new Response('Offline resource not available', { status: 503, statusText: 'Service Unavailable' });
        });
      })
    );
  } else {
    // Network-First, falling back to cache for document pages (cheatsheets, tools)
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Offline fallback: match from cache
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // If the route matches a subtool or page that is pre-cached
            return caches.match('/');
          });
        })
    );
  }
});
