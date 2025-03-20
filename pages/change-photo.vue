<template>
    <div class="bg-white rounded-lg shadow-xl p-8 dark:bg-gray-800 relative">
        <div class="flex flex-col items-center">
            <img :src="user?.photo" class="w-40 border-4 border-white rounded-full" />
        </div>
        <v-alert
            type="error"
            border="start"
            class="mb-4"
            title="Error"
            variant="tonal"
            density="default"
            :text="errorMsg"
            v-if="errorMsg"
        ></v-alert>
        <form class="mt-4" @submit.prevent="submit">
            <v-file-upload
                v-model="photo.value.value"
                density="compact"
                variant="compact"
                icon="mdi:mdi-upload"
                label="Upload Image"
                :error-messages="photo.errorMessage.value"
            ></v-file-upload>
            <v-btn color="indigo" type="submit" class="w-full mt-5" :disabled="loading">
                <span v-if="!loading">
                    Change Photo <v-icon class="ml-2" icon="mdi:mdi-send"></v-icon>
                </span>
                <v-icon v-else icon="fas fa-circle-notch fa-spin"></v-icon>
            </v-btn>
        </form>
    </div>
</template>

<script setup>
const authStore = useAuthStore();
const config = useRuntimeConfig();
const loading = ref(false);
const errorMsg = ref("");

const user = computed(() => authStore.user);

const { handleSubmit } = useForm({
    validationSchema: {
        photo(value) {
            if (!value) {
                return "Please select a photo";
            }
            return true;
        },
    },
});

const photo = useField("photo");

const submit = handleSubmit(async (values) => {
    loading.value = true;
    const formData = new FormData();
    formData.append("photo", values.photo);
    try {
        const res = await $fetch(`${config.public.apiBase}/users/upload-photo`, {
            method: "PUT",
            body: formData,
            headers: { token: authStore.token },
        });
        loading.value = false;
        authStore.getUser(authStore.token);
        photo.value.value = null;
    } catch (error) {
        console.log(error);
        errorMsg.value = error.data.error;
        loading.value = false;
    }
});
definePageMeta({
    middleware: ["auth"],
});
</script>

<style lang="scss" scoped></style>
