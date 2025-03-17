// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
    compatibilityDate: "2025-03-12",
    devtools: { enabled: true },
    css: ["~/assets/css/main.css"],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    build: {
        transpile: ["vuetify"],
    },
    plugins: ["~/plugins/auth.js"],
    modules: [
        (_options, nuxt) => {
            nuxt.hooks.hook("vite:extendConfig", (config) => {
                // @ts-expect-error
                config.plugins.push(vuetify({ autoImport: true }));
            });
        },
        "@nuxtjs/tailwindcss",
        "@vee-validate/nuxt",
        "@pinia/nuxt",
        "@nuxtjs/color-mode",
    ],
    vite: {
        vue: {
            template: {
                transformAssetUrls,
            },
        },
    },
    app: {
        head: {
            charset: "utf-8",
            viewport: "width=device-width, initial-scale=1",
            title: "Social App",
            meta: [{ name: "description", content: "Nuxt 3 + Vuetify 3" }],
            link: [
                { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
                {
                    rel: "stylesheet",
                    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
                },
                {
                    rel: "stylesheet",
                    href: "https://use.fontawesome.com/releases/v5.0.13/css/all.css",
                },
            ],
        },
    },
    runtimeConfig: {
        public: {
            apiBase: process.env.PUBLIC_API_URL,
        },
    },
});
