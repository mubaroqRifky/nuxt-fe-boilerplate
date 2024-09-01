const title = "app-name";
const icon = "/images/android-launchericon-144-144.png";
const badge = "/images/icon.png";
const options = { icon, badge };

self.addEventListener("install", function (event) {
    // Activate worker immediately
    event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", function (event) {
    // Become available to all pages
    event.waitUntil(self.clients.claim());
});

// Show notification when received
self.addEventListener("message", (event) => {
    options.body = event.data || "No payload";
    self.registration
        .showNotification(title, options)
        .catch((error) => console.log(error));
});

self.addEventListener("push", (event) => {
    options.body = event.data?.text() || "No payload";
    event.waitUntil(
        clients.matchAll({ type: "window" }).then((windowClients) => {
            if (isOpenWindow(windowClients)) {
                const channel = new BroadcastChannel("sw-messages");
                channel.postMessage({ payload: options.body });
            } else {
                self.registration.showNotification(title, options);
            }
        })
    );
});

self.addEventListener("notificationclick", function (event) {
    // Android needs explicit close.
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: "window" }).then((windowClients) => {
            // If so, just focus it.
            if (isOpenWindow(windowClients)) return client.focus();
            // If not, then open the target URL in a new window/tab.
            return clients.openWindow(self.location.origin);
        })
    );
});

const isOpenWindow = (windowClients) => {
    let url = self.location.origin;
    for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url && client.url.match(url)) return true;
    }
    return false;
};
