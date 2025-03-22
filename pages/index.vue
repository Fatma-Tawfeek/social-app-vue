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
</template>

<script setup>
const posts = ref([]);
const loading = ref(false);
const paginationInfo = ref({});

onMounted(async () => {
    await changePage();
});

async function changePage(page = 1) {
    loading.value = true;
    const token = localStorage.getItem("token");
    try {
        const response = await $fetch(`https://linked-posts.routemisr.com/posts?page=${page}`, {
            method: "GET",
            headers: { token: token },
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

definePageMeta({
    middleware: "auth",
});
</script>

<style lang="scss" scoped></style>
