import Authenticate from "../apis/Authenticate.ts";

export default defineNuxtPlugin(() => {
    return {
        provide: {
            auth: new Authenticate(),
        },
    };
});
