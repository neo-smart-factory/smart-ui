// Minimal Service Worker to avoid 404s
self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
    const request = event.request;

    // Consideramos como "API" requisições sem destination (XHR/fetch)
    // ou que explicitamente aceitam JSON.
    const isApiRequest =
        request.destination === '' ||
        ((request.headers.get('accept') || '').includes('application/json'));

    if (isApiRequest) {
        // Pass-through com fallback JSON específico para APIs em caso de erro de rede
        event.respondWith(
            fetch(request).catch(
                () =>
                    new Response(JSON.stringify({ error: 'Network unavailable' }), {
                        status: 503,
                        headers: { 'Content-Type': 'application/json' },
                    }),
            ),
        );
    } else {
        // Para navegação, assets estáticos etc., apenas faz pass-through.
        // Em caso de falha de rede, o navegador tratará como erro normal,
        // sem retornar JSON inesperado.
        event.respondWith(fetch(request));
    }
});
