import Echo from "laravel-echo";
import Pusher from "pusher-js";

export default defineNuxtPlugin((nuxtApp) => {
    const { PUSHER_APP_KEY, PUSHER_HOST, PUSHER_PORT } =
        useRuntimeConfig().public;

    window.Pusher = Pusher;

    window.Echo = new Echo({
        broadcaster: "pusher",
        key: PUSHER_APP_KEY,
        wsHost: PUSHER_HOST,
        wsPort: PUSHER_PORT,
        disableStats: true,
        cluster: "mt1",
        forceTLS: false,
        enabledTransports: ["ws", "wss"],
    });
});
