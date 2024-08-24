import VueJwtDecode from "vue-jwt-decode";

export default defineNuxtPlugin(() => {
    return {
        provide: {
            jwt: VueJwtDecode,
        },
    };
});
