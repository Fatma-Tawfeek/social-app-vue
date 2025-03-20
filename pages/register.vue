<template>
    <div class="flex min-h-screen">
        <div class="form basis-1/2 px-10 flex flex-col justify-center">
            <h1 class="text-3xl font-bold text-center mb-4">Register</h1>
            <v-alert
                type="error"
                class="mb-4"
                title="Error"
                variant="tonal"
                density="compact"
                v-if="errorMsg"
                >{{ errorMsg }}</v-alert
            >
            <form @submit.prevent="submit">
                <v-text-field
                    v-model="name.value.value"
                    color="indigo"
                    :counter="10"
                    :error-messages="name.errorMessage.value"
                    label="Name"
                ></v-text-field>

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
                    hint="At least 8 characters"
                    label="Password"
                    :error-messages="password.errorMessage.value"
                    counter
                    @click:append="show1 = !show1"
                ></v-text-field>

                <v-text-field
                    v-model="rePassword.value.value"
                    color="indigo"
                    :append-icon="show1 ? 'mdi:mdi-eye' : 'mdi:mdi-eye-off'"
                    :type="show1 ? 'text' : 'password'"
                    hint="At least 8 characters"
                    label="Confirm Password"
                    :error-messages="rePassword.errorMessage.value"
                    counter
                    @click:append="show1 = !show1"
                ></v-text-field>

                <v-select
                    v-model="gender.value.value"
                    color="indigo"
                    :error-messages="gender.errorMessage.value"
                    :items="items"
                    label="Gender"
                ></v-select>

                <v-date-input
                    v-model="dateOfBirth.value.value"
                    :error-messages="dateOfBirth.errorMessage.value"
                    label="Date of birth"
                    color="indigo"
                ></v-date-input>

                <v-btn class="me-4" color="indigo" type="submit" :disabled="loading">
                    <span v-if="!loading">Register </span>
                    <v-icon v-else icon="fas fa-circle-notch fa-spin"></v-icon>
                </v-btn>

                <v-btn @click="resetForm">Clear</v-btn>
            </form>
            <div class="text-center mt-4">
                <span>Already have an account? </span>
                <NuxtLink to="/login" class="text-indigo-500 underline">Login</NuxtLink>
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
        name: (value) => (value?.length >= 2 ? true : "Name needs to be at least 2 characters."),
        email: (value) =>
            /^[a-z0-9.-]+@[a-z0-9.-]+\.[a-z]+$/i.test(value) ? true : "Must be a valid e-mail.",
        gender: (value) => (value ? true : "Select an item."),
        password: (value) =>
            value?.length >= 8 ? true : "Password needs to be at least 8 characters.",
        rePassword: (value) => {
            if (value != password.value.value) {
                return "Password doesn't match";
            } else if (value?.length < 8) {
                return "Password needs to be at least 8 characters.";
            } else {
                return true;
            }
        },
        dateOfBirth: (value) => (value ? true : "Select a date."),
    },
});

const name = useField("name");
const email = useField("email");
const password = useField("password");
const rePassword = useField("rePassword");
const dateOfBirth = useField("dateOfBirth");
const gender = useField("gender");
const items = ref(["male", "female"]);
const config = useRuntimeConfig();
const router = useRouter();
const errorMsg = ref("");

const submit = handleSubmit(async (values) => {
    loading.value = true;
    try {
        const res = await $fetch(`${config.public.apiBase}/users/signup`, {
            method: "POST",
            body: values,
        });
        loading.value = false;
        router.push("/login");
    } catch (error) {
        errorMsg.value = error.data.error;
        loading.value = false;
    }
});

definePageMeta({
    layout: "auth",
    middleware: "guest",
});
</script>

<style lang="scss" scoped></style>
