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

        <v-btn color="indigo" type="submit" class="w-full" :disabled="loading">
            <span v-if="!loading"> Post <v-icon class="ml-2" icon="mdi:mdi-send"></v-icon> </span>
            <v-icon v-else icon="fas fa-circle-notch fa-spin"></v-icon>
        </v-btn>
    </form>
    <!-- success message -->
    <v-snackbar v-model="snackbar" :timeout="timeout">
        Post added successfully

        <template v-slot:actions>
            <v-btn color="blue" variant="text" @click="snackbar = false"> Close </v-btn>
        </template>
    </v-snackbar>
</template>

<script setup>
import { useField, useForm } from "vee-validate";

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
const loading = ref(false);
const timeout = ref(3000);
const snackbar = ref(false);

const submit = handleSubmit(async (values) => {
    loading.value = true;
    const formData = new FormData();
    formData.append("body", values.body);
    if (values.image) {
        formData.append("image", values.image);
    }
    const token = localStorage.getItem("token");
    try {
        const res = await $fetch(`${useRuntimeConfig().public.apiBase}/posts`, {
            method: "POST",
            body: formData,
            headers: { token: token },
        });
        body.value.value = " ";
        image.value.value = null;
        snackbar.value = true;
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false;
    }
});
</script>

<style lang="scss" scoped></style>
