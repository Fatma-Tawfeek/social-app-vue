<template>
    <v-dialog max-width="500" v-model="dialog">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn v-bind="activatorProps" color="white" text="Edit" variant="flat"></v-btn>
        </template>

        <template v-slot:default="{ isActive }">
            <v-card title="Dialog">
                <v-card-text>
                    <form class="mb-5" @submit.prevent="editPost">
                        <v-textarea
                            variant="solo"
                            v-model="body.value.value"
                            :error-messages="body.errorMessage.value"
                        ></v-textarea>

                        <v-file-input
                            v-model="image.value.value"
                            label="Upload Image"
                            variant="solo"
                            accept="image/png, image/jpeg, image/bmp"
                            prepend-icon="mdi:mdi-camera"
                            :error-messages="image.errorMessage.value"
                        ></v-file-input>

                        <v-btn color="indigo" type="submit" class="w-full" :disabled="loading">
                            <span v-if="!loading">
                                Post
                                <v-icon class="ml-2" icon="mdi:mdi-send"></v-icon>
                            </span>
                            <v-icon v-else icon="fas fa-circle-notch fa-spin"></v-icon>
                        </v-btn>
                    </form>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn text="Close Dialog" @click="isActive.value = false"></v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>

<script setup>
const { post } = defineProps(["post"]);
const config = useRuntimeConfig();
const loading = ref(false);
const dialog = ref(false);
const authStore = useAuthStore();

const { handleSubmit } = useForm({
    validationSchema: {
        body(value) {
            return value ? true : "Body is required.";
        },
        image(value) {
            if (!value) return true;
            const allowedTypes = ["image/png", "image/jpeg", "image/bmp"];
            return allowedTypes.includes(value.type);
        },
    },
});

const body = useField("body");
const image = useField("image");

const editPost = handleSubmit(async (values) => {
    loading.value = true;
    const formData = new FormData();
    formData.append("body", values.body);
    if (values.image) {
        formData.append("image", values.image);
    }
    try {
        const res = await $fetch(`${config.public.apiBase}/posts/${post._id}`, {
            method: "PUT",
            body: formData,
            headers: { token: authStore.token },
        });
        dialog.value = false;
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false;
    }
});

const postBody = ref({ body: post.body });

onMounted(() => {
    body.value.value = postBody.value.body;
});
</script>

<style lang="scss" scoped></style>
