// Minimal Service Worker to avoid 404s
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener("fetch", (event) => {
  // Pass-through
  event.respondWith(fetch(event.request));
});
