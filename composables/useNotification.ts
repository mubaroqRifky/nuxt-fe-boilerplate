export const useNotification = () => {
    // Check if browser support for notification and push manager
    const checkPermission = () => {
        try {
            if (!("serviceWorker" in navigator)) {
                return console.log("No support for service worker!");
            }

            if (!("Notification" in window)) {
                return console.log("No support for notification API");
            }

            if (!("PushManager" in window)) {
                return console.log("No support for Push API");
            }
        } catch (error) {
            throw new ErrorHandler(error);
        }
    };

    // Use the Service Worker API to register a service worker.
    async function registerServiceWorker() {
        navigator.serviceWorker.register("/sw.js", { type: "module" });
    }

    // Request Notification Permission if its disabled
    const requestNotificationPermission = async () => {
        try {
            const permission = await Notification.requestPermission();

            if (permission !== "granted") {
                return console.log("Notification permission not granted");
            }

            return permission;
        } catch (error) {
            throw new ErrorHandler(error);
        }
    };

    // Get the current service worker registration.
    function getRegistration() {
        return navigator.serviceWorker.getRegistration();
    }

    // Unregister a service worker, then update the UI.
    async function unRegisterServiceWorker() {
        let registration = await getRegistration();
        if (registration) {
            await registration.unregister();
        }
    }

    // Create and send a test notification to the service worker.
    async function sendNotification(body = "") {
        let registration = await getRegistration();
        if (registration) {
            if (navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage(body);
            } else {
                console.log(
                    "No service worker controller found. Try a soft reload."
                );
            }
        }
    }

    const InitialNotification = async () => {
        try {
            checkPermission();
            registerServiceWorker();
        } catch (error) {
            console.log(error);
        }
    };

    async function registerPeriodicSync(intervalInSecond = 2 * 60 * 60) {
        // reference registration
        const registration = await navigator.serviceWorker.ready;

        try {
            // feature detection
            if ("periodicSync" in registration) {
                // Background Periodic Sync functionality
                const periodicSync: any = registration.periodicSync;

                await periodicSync.register("sync-periodic", {
                    minInterval: intervalInSecond * 1000,
                });
            }
        } catch (error: any) {
            console.log(
                error.message,
                "Periodic Sync could not be registered!"
            );
        }
    }

    return {
        InitialNotification,
        unRegisterServiceWorker,
        checkPermission,
        requestNotificationPermission,
        getRegistration,
        sendNotification,
        registerPeriodicSync,
    };
};
