/**
 * Service Worker para Rutas Pasto Offline (PWA)
 * Estrategia: Cache First para recursos estáticos del núcleo de la aplicación.
 * Estrategia dinámica con caché para tiles de mapas (OpenStreetMap).
 */

const CACHE_NAME = 'rutas-pasto-v1.0';

const STATIC_ASSETS = [
    './',
    './index.html',
    './styles.css',
    './app.js',
    './manifest.json',
    './data/rutas.js',
    './assets/icons/icon-192.png',
    './assets/icons/icon-512.png',
    './assets/leaflet/leaflet.js',
    './assets/leaflet/leaflet.css',
    './assets/leaflet/images/marker-icon.png',
    './assets/leaflet/images/marker-icon-2x.png',
    './assets/leaflet/images/marker-shadow.png'
];

// Instalación: Pre-almacena en caché todos los recursos estáticos esenciales
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Pre-cacheados los recursos estáticos');
            return cache.addAll(STATIC_ASSETS);
        }).then(() => self.skipWaiting())
    );
});

// Activación: Limpia cachés antiguas y toma el control inmediato de los clientes
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log('[SW] Eliminando caché antigua:', key);
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch: Manejo de peticiones con estrategia Cache First
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Si es un tile de OpenStreetMap o carto/osm
    if (url.hostname.includes('tile.openstreetmap.org')) {
        event.respondWith(
            caches.open('map-tiles-v1').then(async (tileCache) => {
                const cachedResponse = await tileCache.match(event.request);
                if (cachedResponse) {
                    return cachedResponse;
                }
                try {
                    const networkResponse = await fetch(event.request);
                    if (networkResponse && networkResponse.status === 200) {
                        tileCache.put(event.request, networkResponse.clone());
                    }
                    return networkResponse;
                } catch (error) {
                    // Si está offline y no está en caché, responder con respuesta vacía transparente
                    return new Response('', { status: 408, statusText: 'Offline tile unavailable' });
                }
            })
        );
        return;
    }

    // Para recursos propios del sitio (Cache First)
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request).then((networkResponse) => {
                // Si la petición es válida, la agregamos a la caché
                if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return networkResponse;
            }).catch(() => {
                // Si falla la red y es navegación HTML, devolver index.html
                if (event.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
            });
        })
    );
});
