import { resolve } from "path";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    pages: true,
    devtools: { enabled: false },

    devServer: {
        port: 5173,
    },

    app: {
        head: {
            title: "app title",
            htmlAttrs: {
                lang: "id",
                translate: "no",
            },
            meta: [
                { charset: "utf-8" },
                {
                    name: "viewport",
                    content:
                        "width=device-width,initial-scale=1,user-scalable=no",
                },
                { name: "description", content: "app description" },
                { name: "theme-color", content: "#ffffff" },
                { name: "color-scheme", content: "light" },
                {
                    name: "og:image",
                    content: "/images/android-launchericon-512-512.png",
                },
                {
                    name: "og:image:secure_url",
                    content: "/images/android-launchericon-512-512.png",
                },
                { name: "og:image:type", content: "image/png" },
                { name: "og:image:width", content: "512" },
                { name: "og:image:height", content: "512" },
                { name: "og:image:alt", content: "app-name" },
                { name: "og:type", content: "website" },
                { name: "og:site_name", content: "app-name" },
                { name: "og:title", content: "app-name" },
                { name: "og:description", content: "app description" },
                { name: "og:locale", content: "id-ID" },
            ],
            link: [
                {
                    rel: "stylesheet",
                    href: "https://fonts.googleapis.com/icon?family=Material+Icons",
                },
                { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
                {
                    rel: "manifest",
                    href: "/manifest.json",
                    crossorigin: "use-credentials",
                },
            ],
            script: [
                {
                    async: true,
                    src: `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_KEY}&loading=async&libraries=marker,places`,
                },
            ],
        },
        pageTransition: { name: "page", mode: "out-in" },
    },

    ssr: true,
    debug: false,

    imports: {
        dirs: [
            "composables",
            "composables/*/index.{ts,js,mjs,mts}",
            "composables/**",
        ],
    },

    components: [
        {
            path: "~/components",
            pathPrefix: false,
        },
    ],

    runtimeConfig: {
        public: {
            API_URL: process.env.API_URL,
            API_PORT: process.env.API_PORT,
            API_PATH: "/api",
            GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID,
            GOOGLE_TAG_ID: process.env.GOOGLE_TAG_ID,
        },
    },

    alias: {
        "@": resolve(__dirname, "/"),
    },

    css: ["~/assets/scss/main.scss"],

    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },

    modules: [
        "@pinia/nuxt",
        "@pinia-plugin-persistedstate/nuxt",
        "@nuxt/image",
    ],

    build: {
        transpile: ["pinia-plugin-persistedstate"],
    },

    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    silenceDeprecations: ["legacy-js-api"],
                },
            },
        },
    },

    nitro: {
        prerender: {
            ignore: ["/manifest.json"],
        },
    },

    compatibilityDate: "2025-08-01",
});
