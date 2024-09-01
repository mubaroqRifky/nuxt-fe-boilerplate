const app = useNuxtApp();
const token_auth = useCookie("__AUTH_TOKEN__");

class Subscription {
    static PUBLIC_KEY = app.$config.public.PUBLIC_KEY;

    static urlBase64ToUint8Array = (base64String: string) => {
        const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, "+")
            .replace(/_/g, "/");

        const rawData = atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    };

    static subscribe = async (subscription: any) => {
        const key = subscription.getKey("p256dh");
        const token = subscription.getKey("auth");
        const contentEncoding = (PushManager.supportedContentEncodings || [
            "aesgcm",
        ])[0];

        const body = JSON.stringify({
            endpoint: subscription.endpoint,
            publicKey: key
                ? btoa(String.fromCharCode.apply(null, new Uint8Array(key)))
                : null,
            authToken: token
                ? btoa(String.fromCharCode.apply(null, new Uint8Array(token)))
                : null,
            contentEncoding,
        });

        const baseURL = app.$config.public.API_URL;

        fetch(baseURL + "/" + "subscribe", {
            method: "POST",
            body,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token_auth.value}`,
            },
        });
    };

    static requestSubscription = () => {
        return navigator.serviceWorker.ready
            .then((serviceWorkerRegistration) =>
                serviceWorkerRegistration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: Subscription.urlBase64ToUint8Array(
                        Subscription.PUBLIC_KEY
                    ),
                })
            )
            .then((subscription) => {
                Subscription.subscribe(subscription);
            })
            .catch((error) => {
                throw error;
            });
    };
}

export default Subscription;
