self.addEventListener("install", (e) => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("push", (e) => {
  const data = e.data?.json() ?? {};
  e.waitUntil(self.registration.showNotification(data.title ?? "Football Analytics", { body: data.body ?? "" }));
});
