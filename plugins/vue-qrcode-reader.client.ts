import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from "vue-qrcode-reader";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component("qrcode-stream", QrcodeStream);
    nuxtApp.vueApp.component("qrcode-drop-zone", QrcodeDropZone);
    nuxtApp.vueApp.component("qrcode-capture", QrcodeCapture);
});
