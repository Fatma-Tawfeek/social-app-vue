<template>
    <div class="flex min-h-screen">
        <div class="form basis-1/2 px-10 flex flex-col justify-center">
            <h1 class="text-3xl font-bold text-center mb-4">Login</h1>
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
            <form @submit.prevent="submit">
                <v-text-field
                    v-model="email.value.value"
                    color="indigo"
                    :error-messages="email.errorMessage.value"
                    label="E-mail"
                ></v-text-field>

                <v-text-field
                    v-model="password.value.value"
                    color="indigo"
                    :append-icon="show1 ? 'mdi:mdi-eye' : 'mdi:mdi-eye-off'"
                    :type="show1 ? 'text' : 'password'"
                    hint="Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (#?!@$%^&*-)."
                    label="Password"
                    :error-messages="password.errorMessage.value"
                    counter
                    @click:append="show1 = !show1"
                ></v-text-field>

                <v-btn class="me-4" color="indigo" type="submit" :disabled="loading">
                    <span v-if="!loading">Login </span>
                    <v-icon v-else icon="fas fa-circle-notch fa-spin"></v-icon>
                </v-btn>

                <v-btn @click="resetForm"> Clear</v-btn>
            </form>
            <div class="text-center mt-4">
                <span>Don't have an account? </span>
                <NuxtLink to="/register" class="text-indigo-500 underline">Register</NuxtLink>
            </div>
        </div>
        <div
            class="image basis-1/2 bg-[url('@/assets/images/people.jpg')] bg-center bg-cover"
        ></div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useField, useForm } from "vee-validate";

const show1 = ref(false);
const loading = ref(false);

const { handleSubmit, resetForm } = useForm({
    validationSchema: {
        email: (value) =>
            /^[a-z0-9.-]+@[a-z0-9.-]+\.[a-z]+$/i.test(value) ? true : "Must be a valid e-mail.",
        password: (value) =>
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(value)
                ? true
                : "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (#?!@$%^&*-).",
    },
});

const email = useField("email");
const password = useField("password");
const config = useRuntimeConfig();
const router = useRouter();
const errorMsg = ref("");
const authStore = useAuthStore();

const submit = handleSubmit(async (values) => {
    loading.value = true;
    try {
        const res = await $fetch(`${config.public.apiBase}/users/signin`, {
            method: "POST",
            body: values,
        });
        loading.value = false;
        authStore.login(res.token);
        localStorage.setItem("token", res.token);
        router.push("/");
    } catch (error) {
        errorMsg.value = error.data.error;
        loading.value = false;
    }
});

definePageMeta({
    layout: "custom",
});
</script>

<style lang="scss" scoped></style>
