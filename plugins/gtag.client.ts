export default defineNuxtPlugin((nuxtApp) => {
    const { GOOGLE_TAG_ID } = useRuntimeConfig().public;

    if (GOOGLE_TAG_ID) {
        function gtag() {
            window.dataLayer.push(arguments);
        }

        window.dataLayer = window.dataLayer || [];

        gtag("js", new Date());
        gtag("config", GOOGLE_TAG_ID);

        useHead({
            script: [
                {
                    src: `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`,
                    async: true,
                },
            ],
        });
    }
});
