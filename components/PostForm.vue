<template>
    <form class="mb-5" @submit.prevent="submit">
        <v-textarea
            label="What's on your mind"
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

        <v-btn color="indigo" type="submit" class="w-full" :disabled="postStore.loading">
            <span v-if="!postStore.loading">
                Post <v-icon class="ml-2" icon="mdi:mdi-send"></v-icon>
            </span>
            <v-icon v-else icon="fas fa-circle-notch fa-spin"></v-icon>
        </v-btn>
    </form>
</template>

<script setup>
import { useField, useForm } from "vee-validate";
import { usePostStore } from "~/stores/post";

const { handleSubmit } = useForm({
    validationSchema: {
        body(value) {
            return value ? true : "Post is required";
        },
        image(value) {
            if (!value) return true; // الصورة اختيارية
            const allowedTypes = ["image/png", "image/jpeg", "image/bmp"];
            return allowedTypes.includes(value.type);
        },
    },
});

const body = useField("body");
const image = useField("image");
const postStore = usePostStore();

const submit = handleSubmit((post) => {
    postStore.addPost(post);
});
</script>

<style lang="scss" scoped></style>
