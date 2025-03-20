<template>
    <div class="bg-white rounded-lg shadow-xl pb-8 dark:bg-gray-800 relative">
        <div class="absolute right-5 mt-4 rounded">
            <v-menu>
                <template v-slot:activator="{ props }">
                    <v-btn
                        icon="mdi:mdi-dots-vertical"
                        color="white"
                        variant="text"
                        v-bind="props"
                    ></v-btn>
                </template>

                <v-list>
                    <v-list-item value="1">
                        <v-list-item-title>Change Profile Picture</v-list-item-title>
                    </v-list-item>
                    <v-list-item value="2">
                        <v-list-item-title>Change Password</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>
        <div class="w-full h-[250px]">
            <img
                src="https://vojislavd.com/ta-template-demo/assets/img/profile-background.jpg"
                class="w-full h-full rounded-tl-lg rounded-tr-lg"
            />
        </div>
        <div class="flex flex-col items-center -mt-20">
            <img :src="user?.photo" class="w-40 border-4 border-white rounded-full" />
            <div class="flex items-center space-x-2 mt-2">
                <p class="text-2xl">{{ user?.name }}</p>
                <span class="bg-blue-500 rounded-full p-1" title="Verified">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="text-gray-100 h-2.5 w-2.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="4"
                            d="M5 13l4 4L19 7"
                        ></path>
                    </svg>
                </span>
            </div>
            <p class="text-gray-700">Senior Software Engineer at Tailwind CSS</p>
            <p class="text-sm text-gray-500">New York, USA</p>
        </div>
    </div>

    <div class="my-4 flex flex-col items-start 2xl:flex-row space-y-4 2xl:space-y-0 2xl:space-x-4">
        <div class="w-full flex flex-col 2xl:w-1/3">
            <div class="flex-1 bg-white rounded-lg shadow-xl p-8">
                <h4 class="text-xl text-gray-900 font-bold">Personal Info</h4>
                <ul class="mt-2 text-gray-700">
                    <li class="flex border-y py-2">
                        <span class="font-bold w-24">Full name:</span>
                        <span class="text-gray-700">{{ user?.name }}</span>
                    </li>
                    <li class="flex border-b py-2">
                        <span class="font-bold w-24">Birthday:</span>
                        <span class="text-gray-700">{{ user?.dateOfBirth }}</span>
                    </li>
                    <li class="flex border-b py-2">
                        <span class="font-bold w-24">Joined:</span>
                        <span class="text-gray-700">{{ formattedJoinDate }}</span>
                    </li>
                    <li class="flex border-b py-2">
                        <span class="font-bold w-24">Email:</span>
                        <span class="text-gray-700">{{ user?.email }}</span>
                    </li>
                    <li class="flex border-b py-2">
                        <span class="font-bold w-24">Gender:</span>
                        <span class="text-gray-700">{{ user?.gender }}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="flex flex-col w-full 2xl:w-2/3">
            <div class="flex-1 bg-white rounded-lg shadow-xl p-8">
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
                <!-- <Pagination :paginationInfo="paginationInfo" @changePage="get" /> -->
            </div>
        </div>
    </div>
</template>

<script setup>
import { useDate } from "vuetify";

const authStore = useAuthStore();
const joinDate = useDate();
const config = useRuntimeConfig();
const posts = ref([]);
const loading = ref(false);
const paginationInfo = ref({});

onMounted(async () => {
    await getUserPosts();
});

async function getUserPosts() {
    loading.value = true;
    const token = localStorage.getItem("token");
    try {
        const response = await $fetch(
            `${config.public.apiBase}/users/${authStore.user?._id}/posts`,
            {
                method: "GET",
                headers: { token: token },
            }
        );
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
const user = computed(() => authStore.user);
const formattedJoinDate = computed(() => {
    const createdAt = authStore.user?.createdAt;
    if (!createdAt) return "Unknown";
    return joinDate.format(new Date(createdAt), "fullDateWithWeekday");
});

definePageMeta({
    middleware: "auth",
});
</script>

<style lang="scss" scoped></style>
