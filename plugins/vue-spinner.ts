import BounceLoader from "vue-spinner/src/BounceLoader.vue";
import BeatLoader from "vue-spinner/src/BeatLoader.vue";
import MoonLoader from "vue-spinner/src/MoonLoader.vue";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component("BounceLoader", BounceLoader);
    nuxtApp.vueApp.component("BeatLoader", BeatLoader);
    nuxtApp.vueApp.component("MoonLoader", MoonLoader);
});
