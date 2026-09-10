/**
 * Service Worker para Rutas Pasto Offline (PWA)
 * Versión: 1.1
 * Diseñado para garantizar disponibilidad offline instantánea y soporte para PWA instalada en móvil.
 */

const CACHE_NAME = 'rutas-pasto-v1.4';

const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/manifest.json',
    '/data/rutas.js',
    '/data/lugares.js',
    '/assets/icons/icon-192.png',
    '/assets/icons/icon-512.png',
    '/assets/leaflet/leaflet.js',
    '/assets/leaflet/leaflet.css',
    '/assets/leaflet/images/marker-icon.png',
    '/assets/leaflet/images/marker-icon-2x.png',
    '/assets/leaflet/images/marker-shadow.png'
];

// Instalación: Pre-almacena en caché de forma individual y segura cada recurso estático
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            console.log('[SW] Pre-almacenando recursos esenciales...');
            for (const asset of STATIC_ASSETS) {
                try {
                    const response = await fetch(asset, { cache: 'no-cache' });
                    if (response.ok) {
                        await cache.put(asset, response.clone());
                        // Asegurar compatibilidad cruzada entre '/' e '/index.html'
                        if (asset === '/' || asset === '/index.html') {
                            await cache.put('/', response.clone());
                            await cache.put('/index.html', response.clone());
                            await cache.put('./', response.clone());
                            await cache.put('./index.html', response.clone());
                        }
                    }
                } catch (err) {
                    console.warn('[SW] Advertencia al cachear:', asset, err);
                }
            }
            console.log('[SW] Pre-caché completado con éxito.');
        }).then(() => self.skipWaiting())
    );
});

// Activación: Limpieza de versiones antiguas de caché y control inmediato
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME && key !== 'map-tiles-v1') {
                        console.log('[SW] Eliminando caché antigua:', key);
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch: Manejo optimizado para navegación PWA, recursos estáticos y mapa
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // 1. Mosaicos de mapa (OpenStreetMap)
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
                    return new Response('', { status: 408, statusText: 'Tile offline' });
                }
            })
        );
        return;
    }

    // 2. Peticiones de Navegación (HTML de inicio / apertura de la PWA instalada)
    const isNavigation = event.request.mode === 'navigate' || 
                         (event.request.method === 'GET' && event.request.headers.get('accept')?.includes('text/html'));

    if (isNavigation) {
        event.respondWith(
            (async () => {
                const cache = await caches.open(CACHE_NAME);

                // Prioridad Cache First para arranque instantáneo de la app instalada
                const cached = await cache.match(event.request, { ignoreSearch: true })
                    || await cache.match('/', { ignoreSearch: true })
                    || await cache.match('/index.html', { ignoreSearch: true })
                    || await cache.match('./', { ignoreSearch: true });

                if (cached) {
                    // En segundo plano actualizar si hay conexión
                    fetch(event.request).then((networkResponse) => {
                        if (networkResponse && networkResponse.status === 200) {
                            cache.put(event.request, networkResponse.clone());
                            cache.put('/', networkResponse.clone());
                        }
                    }).catch(() => { /* Sin conexión: continuar con caché */ });

                    return cached;
                }

                // Si no estaba en caché, buscar en red
                try {
                    const networkResponse = await fetch(event.request);
                    if (networkResponse && networkResponse.status === 200) {
                        cache.put(event.request, networkResponse.clone());
                        cache.put('/', networkResponse.clone());
                    }
                    return networkResponse;
                } catch (err) {
                    // Fallback a la raíz si falla la red
                    const fallback = await cache.match('/', { ignoreSearch: true }) 
                                  || await cache.match('/index.html', { ignoreSearch: true });
                    if (fallback) return fallback;

                    return new Response('Aplicación sin conexión disponible.', {
                        status: 200,
                        headers: { 'Content-Type': 'text/html; charset=utf-8' }
                    });
                }
            })()
        );
        return;
    }

    // 3. Recursos estáticos (CSS, JS, imágenes, iconos, fuentes) - Cache First
    event.respondWith(
        caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request).then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return networkResponse;
            }).catch(() => {
                return new Response('', { status: 408, statusText: 'Resource unavailable offline' });
            });
        })
    );
});
