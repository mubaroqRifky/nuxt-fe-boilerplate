import Authenticate from "../apis/Authenticate.ts";
import Subscription from "../apis/Subscription.ts";

export default defineNuxtPlugin(() => {
    return {
        provide: {
            auth: new Authenticate(),
            subscription: new Subscription(),
        },
    };
});
