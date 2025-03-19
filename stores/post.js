import { defineStore } from "pinia";

export const usePostStore = defineStore("postStore", {
    state: () => ({
        posts: [],
        loading: false,
        snackbar: false,
    }),
    actions: {
        // Add new post
        async addPost(values) {
            const authStore = useAuthStore();
            this.loading = true;
            const post = new FormData();
            post.append("body", values.body);
            if (values.image) {
                post.append("image", values.image);
            }
            try {
                const res = await $fetch(`${useRuntimeConfig().public.apiBase}/posts`, {
                    method: "POST",
                    body: post,
                    headers: { token: authStore.token },
                });
                this.snackbar = true;
            } catch (error) {
                console.log(error);
            } finally {
                this.loading = false;
            }
        },
    },
});
