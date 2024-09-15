import Authenticate from "../apis/Authenticate.ts";
import Subscription from "../apis/Subscription.ts";
import User from "../apis/User.ts";
import Chat from "../apis/Chat.ts";

export default defineNuxtPlugin(() => {
    return {
        provide: {
            auth: new Authenticate(),
            subscription: new Subscription(),
            user: new User(),
            chat: new Chat(),
        },
    };
});
