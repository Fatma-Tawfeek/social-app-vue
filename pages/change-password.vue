<template>
    <div class="bg-white rounded-lg shadow-xl p-8 dark:bg-gray-800 relative">
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
            <v-text-field
                v-model="password.value.value"
                color="indigo"
                :append-icon="show1 ? 'mdi:mdi-eye' : 'mdi:mdi-eye-off'"
                :type="show1 ? 'text' : 'password'"
                hint="At least 8 characters"
                label="Current Password"
                :error-messages="password.errorMessage.value"
                counter
                @click:append="show1 = !show1"
            ></v-text-field>
            <v-text-field
                v-model="newPassword.value.value"
                color="indigo"
                :append-icon="show1 ? 'mdi:mdi-eye' : 'mdi:mdi-eye-off'"
                :type="show1 ? 'text' : 'password'"
                hint="At least 8 characters"
                label="New Password"
                :error-messages="newPassword.errorMessage.value"
                counter
                @click:append="show1 = !show1"
            ></v-text-field>
            <v-btn color="indigo" type="submit" class="w-full mt-5" :disabled="loading">
                <span v-if="!loading">
                    Change Password <v-icon class="ml-2" icon="mdi:mdi-send"></v-icon>
                </span>
                <v-icon v-else icon="fas fa-circle-notch fa-spin"></v-icon>
            </v-btn>
        </form>
    </div>
    <!-- success message -->
    <v-snackbar v-model="snackbar" :timeout="timeout">
        Password changed successfully
        <template v-slot:actions>
            <v-btn color="blue" variant="text" @click="snackbar = false"> Close </v-btn>
        </template>
    </v-snackbar>
</template>

<script setup>
const authStore = useAuthStore();

const loading = ref(false);
const errorMsg = ref("");
const timeout = ref(3000);
const snackbar = ref(false);
const show1 = ref(false);

const { handleSubmit } = useForm({
    validationSchema: {
        password: (value) =>
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(value)
                ? true
                : "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (#?!@$%^&*-).",

        newPassword: (value) =>
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(value)
                ? true
                : "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (#?!@$%^&*-).",
    },
});

const password = useField("password");
const newPassword = useField("newPassword");

const submit = handleSubmit(async (values) => {
    loading.value = true;
    try {
        const res = await $fetch(`https://linked-posts.routemisr.com/users/change-password`, {
            method: "PATCH",
            body: values,
            headers: { token: authStore.token },
        });
        loading.value = false;
        password.value.value = " ";
        newPassword.value.value = " ";
        snackbar.value = true;
    } catch (error) {
        errorMsg.value = error.data.error;
        loading.value = false;
    }
});

definePageMeta({
    middleware: ["auth"],
});
</script>

<style lang="scss" scoped></style>
