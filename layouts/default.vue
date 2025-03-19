<template>
    <v-layout ref="app" class="rounded rounded-md border">
        <v-navigation-drawer
            v-model="drawer"
            :rail="rail"
            permanent
            @click="rail = false"
            color="indigo"
        >
            <v-list-item :prepend-avatar="authStore.user?.photo" :title="authStore.user?.name" nav>
                <template v-slot:append>
                    <v-btn
                        icon="mdi:mdi-chevron-left"
                        variant="text"
                        @click.stop="rail = !rail"
                    ></v-btn>
                </template>
            </v-list-item>

            <v-divider></v-divider>

            <v-list density="compact" nav>
                <NuxtLink to="/">
                    <v-list-item
                        prepend-icon="mdi:mdi-home-city"
                        title="Home"
                        value="home"
                    ></v-list-item>
                </NuxtLink>

                <NuxtLink to="/profile">
                    <v-list-item
                        prepend-icon="mdi:mdi-account"
                        title="My Account"
                        value="account"
                    ></v-list-item>
                </NuxtLink>
                <v-list-item
                    prepend-icon="mdi:mdi-account-group-outline"
                    title="Users"
                    value="users"
                ></v-list-item>
                <!-- logout -->
                <v-list-item
                    prepend-icon="mdi:mdi-logout"
                    title="Logout"
                    value="logout"
                    @click="authStore.logout"
                ></v-list-item>
            </v-list>
        </v-navigation-drawer>
        <v-app-bar title="Social App" app>
            <v-btn @click="toggleTheme">
                <v-icon icon="mdi:mdi-theme-light-dark"></v-icon>
            </v-btn>
        </v-app-bar>

        <v-main class="d-flex align-center justify-center bg-gray-100 dark:bg-gray-900">
            <v-container>
                <slot></slot>
            </v-container>
        </v-main>

        <v-footer color="surface-light" name="footer" app>
            <v-btn v-for="link in links" :key="link" :text="link" variant="text" rounded></v-btn>
            <div class="flex-1-0-100 text-center mt-2">
                {{ new Date().getFullYear() }} —
                <strong class="text-indigo-500 font-bold">Social App</strong>
            </div>
        </v-footer>
    </v-layout>
</template>

<script setup>
import { ref } from "vue";
import { useTheme } from "vuetify";

const theme = useTheme();
const authStore = useAuthStore();
const colorMode = useColorMode();

function toggleTheme() {
    theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
    colorMode.value = colorMode.value === "light" ? "dark" : "light";
}

const drawer = ref(true);
const rail = ref(true);
const links = ["Home", "About Us", "Team", "Services", "Blog", "Contact Us"];
</script>

<style lang="scss" scoped></style>
