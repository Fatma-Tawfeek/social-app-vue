import { defineStore } from "pinia";

export const useAuthStore = defineStore("authStore", {
    state: () => ({
        user: null,
        token: null,
        isAuthenticated: false,
    }),
    persist: true,
    actions: {
        login(token) {
            this.token = token;
            this.isAuthenticated = true;
        },
        logout() {
            this.token = null;
            this.isAuthenticated = false;
        },
        async getUser(token) {
            try {
                const res = await $fetch(`https://linked-posts.routemisr.com/users/profile-data`, {
                    method: "GET",
                    headers: { token: token },
                });
                this.user = res.user;
            } catch (error) {
                console.log(error);
            }
        },
    },
});
