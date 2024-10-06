export default defineNuxtPlugin((nuxtApp) => {
    useHead({
        script: [
            {
                src: `https://cdn.metered.ca/sdk/video/1.4.6/sdk.min.js`,
                // defer: true,
                onload: () => {
                    const meeting = new Metered.Meeting();
                    window.meeting = meeting;
                },
            },
            {
                src: `https://cdn.metered.ca/sdk/frame/1.4.3/sdk-frame.min.js`,
                // defer: true,
                onload: () => {
                    // const frame = new MeteredFrame();
                    // window.frame = frame;
                },
            },
        ],
    });
});
