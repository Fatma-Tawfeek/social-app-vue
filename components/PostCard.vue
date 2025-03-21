<template>
    <!-- component -->
    <div class="bg-white p-8 rounded-lg shadow-md dark:bg-gray-800 dark:text-gray-100">
        <!-- User Info with Three-Dot Menu -->
        <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-2">
                <img :src="post.user.photo" alt="User Avatar" class="w-8 h-8 rounded-full" />
                <div>
                    <p class="text-gray-800 font-semibold">{{ post.user.name }}</p>
                    <p class="text-gray-500 text-sm">{{ formattedDate }}</p>
                </div>
            </div>
            <div class="text-gray-500 cursor-pointer">
                <!-- Three-dot menu icon -->
                <v-menu v-if="authStore.user._id === post.user._id">
                    <template v-slot:activator="{ props }">
                        <v-btn
                            icon="mdi:mdi-dots-vertical"
                            color="gray"
                            variant="text"
                            v-bind="props"
                        ></v-btn>
                    </template>

                    <v-list>
                        <v-list-item value="1">
                            <v-list-item-title>
                                <EditPost :post="post" />
                            </v-list-item-title>
                        </v-list-item>

                        <v-list-item value="2" @click="$emit('deletePost', post.id)">
                            <v-list-item-title>Delete</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </div>
        </div>
        <!-- Message -->
        <div class="mb-4">
            <p class="text-gray-800">
                {{ post.body }}
            </p>
        </div>
        <!-- Image -->
        <div class="mb-4 bg-gray-100 rounded-md" v-if="post.image">
            <img :src="post.image" alt="Post Image" class="w-1/2 mx-auto object-cover rounded-md" />
        </div>
        <!-- Like and Comment Section -->
        <div class="flex items-center justify-between text-gray-500">
            <div class="flex items-center space-x-2">
                <button
                    class="flex justify-center items-center gap-2 px-2 hover:bg-gray-50 rounded-full p-1"
                >
                    <svg
                        class="w-5 h-5 fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                    >
                        <path
                            d="M12 21.35l-1.45-1.32C6.11 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-4.11 6.86-8.55 11.54L12 21.35z"
                        />
                    </svg>
                    <span>42 Likes</span>
                </button>
            </div>
            <button
                class="flex justify-center items-center gap-2 px-2 hover:bg-gray-50 rounded-full p-1"
            >
                <svg
                    width="22px"
                    height="22px"
                    viewBox="0 0 24 24"
                    class="w-5 h-5 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22ZM8 13.25C7.58579 13.25 7.25 13.5858 7.25 14C7.25 14.4142 7.58579 14.75 8 14.75H13.5C13.9142 14.75 14.25 14.4142 14.25 14C14.25 13.5858 13.9142 13.25 13.5 13.25H8ZM7.25 10.5C7.25 10.0858 7.58579 9.75 8 9.75H16C16.4142 9.75 16.75 10.0858 16.75 10.5C16.75 10.9142 16.4142 11.25 16 11.25H8C7.58579 11.25 7.25 10.9142 7.25 10.5Z"
                        ></path>
                    </g>
                </svg>
                <span>{{ post.comments.length }} Comment</span>
            </button>
        </div>
        <hr class="mt-2 mb-2" />
        <p class="text-gray-800 font-semibold">Comment</p>
        <hr class="mt-2 mb-2" />
        <div class="mt-4">
            <!-- Comment 1 -->
            <div
                class="flex items-center space-x-2"
                v-for="comment in sortedComments.slice(0, 2)"
                :key="comment._id"
            >
                <img
                    src="@/assets/images/user.png"
                    alt="User Avatar"
                    class="w-6 h-6 rounded-full"
                />
                <div>
                    <p class="text-gray-800 font-semibold">{{ comment.commentCreator.name }}</p>
                    <p class="text-gray-500 text-sm">{{ comment.content }}</p>
                </div>
            </div>
            <!-- Comment Form -->
            <form class="w-full max-w-xl bg-white rounded-lg px-4 pt-2" @submit.prevent="submit">
                <div class="flex flex-wrap -mx-3 mb-6">
                    <div class="w-full px-3 mt-2">
                        <v-textarea
                            label="Type Your Comment"
                            variant="solo-filled"
                            rows="2"
                            v-model="content.value.value"
                            :error-messages="content.errorMessage.value"
                        ></v-textarea>
                    </div>
                    <div class="w-full md:w-full md:w-full px-3">
                        <div class="-mr-1">
                            <v-btn
                                type="submit"
                                class="text-white font-medium py-1 px-4 border border-gray-400 rounded-lg tracking-wide mr-1 hover:bg-indigo-400"
                                color="indigo"
                            >
                                <span v-if="!loading">
                                    Send Comment <v-icon class="ml-2" icon="mdi:mdi-send"></v-icon>
                                </span>
                                <v-icon v-else icon="fas fa-circle-notch fa-spin"></v-icon>
                            </v-btn>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
    <!-- success message -->
    <v-snackbar v-model="snackbar" :timeout="timeout">
        Comment added successfully

        <template v-slot:actions>
            <v-btn color="blue" variant="text" @click="snackbar = false"> Close </v-btn>
        </template>
    </v-snackbar>
</template>

<script setup>
import { useDate } from "vuetify";

const { post } = defineProps(["post"]);

const date = useDate();

const authStore = useAuthStore();

const config = useRuntimeConfig();

const loading = ref(false);

const snackbar = ref(false);
const timeout = ref(3000);

const comments = ref([]);

const formattedDate = computed(() => date.format(new Date(post?.createdAt), "fullDateWithWeekday"));

// Comment
const { handleSubmit } = useForm({
    validationSchema: {
        content(value) {
            return value ? true : "Comment is required.";
        },
    },
});

const content = useField("content");

const submit = handleSubmit(async (values) => {
    loading.value = true;
    try {
        const res = await $fetch(`${config.public.apiBase}/comments`, {
            method: "POST",
            body: {
                content: values.content,
                post: post._id,
            },
            headers: { token: authStore.token },
        });
        await getPostComments();
        snackbar.value = true;
        content.value.value = " ";
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false;
    }
});

async function getPostComments() {
    const token = localStorage.getItem("token");
    try {
        const response = await $fetch(`${config.public.apiBase}/posts/${post._id}/comments`, {
            method: "GET",
            headers: { token: token },
        });
        comments.value = response.comments;
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

const sortedComments = computed(() => {
    return comments.value.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
});

defineEmits(["deletePost"]);

onMounted(() => {
    getPostComments();
});
</script>

<style lang="scss" scoped></style>
