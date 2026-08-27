self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("tanal-sa-logement-v1").then((cache) => {
      return cache.addAll(["/", "/index.html", "/src/main.jsx", "/src/App.jsx"]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
           .filter((name) => name !== "tanal-sa-logement-v1")
          .map((name) => caches.delete(name))
      );
    })
  );
});
