<template>
    <v-layout ref="app" class="rounded rounded-md border">
        <v-main class="d-flex align-center justify-center" height="300">
            <v-container>
                <slot></slot>
            </v-container>
        </v-main>
    </v-layout>
</template>

<script setup></script>

<style lang="scss" scoped></style>
