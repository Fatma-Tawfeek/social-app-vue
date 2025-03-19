import { defineStore } from "pinia";

export const useAuthStore = defineStore("authStore", {
    state: () => ({
        user: null,
        token: null,
        isAuthenticated: false,
    }),
    actions: {
        login(token) {
            // this.user = jwtDecode(token);s
            this.token = token;
            this.isAuthenticated = true;
        },
        logout() {
            this.token = null;
            this.isAuthenticated = false;
        },
        async getUser(token) {
            try {
                const res = await $fetch(
                    `${useRuntimeConfig().public.apiBase}/users/profile-data`,
                    {
                        method: "GET",
                        headers: { token: token },
                    }
                );
                this.user = res.user;
            } catch (error) {
                console.log(error);
            }
        },
    },
});
