// DOSAPALM V1 — service worker (PWA). Generado por build-standalone.ts:
// 202609242204 se reemplaza por el sello de build, así cada publicación crea una
// caché nueva y la anterior se borra. Estrategia: RED PRIMERO (siempre la
// versión más nueva si hay conexión) y caché de respaldo para trabajar sin
// internet en el campo. El Bluetooth no pasa por aquí.
const CACHE = 'dosapalm-__BUILD__'
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-512-maskable.png', './apple-touch-icon.png']

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()))
})
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()))
})
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url)
  if (e.request.method !== 'GET' || url.origin !== location.origin) return   // la nube (Supabase) y el equipo no se cachean
  e.respondWith(
    fetch(e.request).then(r => {
      if (r && r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)) }
      return r
    }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  )
})
