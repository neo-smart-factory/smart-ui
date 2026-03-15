// Minimal Service Worker to avoid 404s
self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
    // Pass-through com fallback para erros de rede
    event.respondWith(
        fetch(event.request).catch(() =>
            new Response(JSON.stringify({ error: 'Network unavailable' }), {
                status: 503,
                headers: { 'Content-Type': 'application/json' }
            })
        )
    );
});
