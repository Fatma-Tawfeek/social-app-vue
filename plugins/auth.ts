import { useAuthStore } from "~/stores/auth";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook("app:mounted", () => {
        if (localStorage.getItem("token")) {
            const authStore = useAuthStore();
            authStore.login(localStorage.getItem("token"));
            authStore.getUser(localStorage.getItem("token"));
        }
    });
});
