<template>
    <PostForm />
    <v-skeleton-loader
        class="mx-auto"
        elevation="12"
        type="table-heading, list-item-two-line, image, table-tfoot"
        v-if="loading"
    ></v-skeleton-loader>
    <div class="space-y-4" v-else>
        <PostCard v-for="post in sortedPosts" :key="post.id" :post="post" />
    </div>
    <Pagination :paginationInfo="paginationInfo" @changePage="changePage" />
    <!-- success message -->
    <v-snackbar v-model="postStore.snackbar" :timeout="timeout">
        Post added successfully

        <template v-slot:actions>
            <v-btn color="blue" variant="text" @click="snackbar = false"> Close </v-btn>
        </template>
    </v-snackbar>
</template>

<script setup>
const config = useRuntimeConfig();
const authStore = useAuthStore();
const postStore = usePostStore();
const posts = ref([]);
const loading = ref(false);
const paginationInfo = ref({});
const timeout = ref(3000);

onMounted(async () => {
    await changePage();
});

async function changePage(page = 1) {
    loading.value = true;
    try {
        const response = await $fetch(`${config.public.apiBase}/posts?page=${page}`, {
            method: "GET",
            headers: { token: authStore.token },
        });
        posts.value = response.posts;
        paginationInfo.value = response.paginationInfo;
    } catch (error) {
        console.error("Fetch error:", error);
    } finally {
        loading.value = false;
    }
}

const sortedPosts = computed(() => {
    return posts.value.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
});
</script>

<style lang="scss" scoped></style>
