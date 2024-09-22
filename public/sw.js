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
    const pushData = event.data?.text() || "No payload";
    const payload = parsePayloadToObject(pushData);
    console.log("message", payload);

    self.registration
        .showNotification(title, payload)
        .catch((error) => console.log(error));
});

self.addEventListener("push", (event) => {
    const pushData = event.data?.text() || "No payload";
    const payload = parsePayloadToObject(pushData);
    console.log("push", payload);

    event.waitUntil(
        clients.matchAll({ type: "window" }).then((windowClients) => {
            if (isOpenWindow(windowClients)) {
                const channel = new BroadcastChannel("sw-messages");
                channel.postMessage(payload);
            } else {
                self.registration.showNotification(title, payload);
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

const parsePayloadToObject = (body) => {
    try {
        const payload = JSON.parse(body);
        return { icon, badge, body: payload.body, data: payload };
    } catch (error) {
        return { icon, badge, body, data: payload };
    }
};
