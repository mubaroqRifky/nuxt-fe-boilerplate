import EmbedPDF from "vue-pdf-embed";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component("embed-pdf", EmbedPDF);
});
