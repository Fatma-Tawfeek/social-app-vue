<template>
    <div class="text-center">
        <v-container>
            <v-row justify="center">
                <v-col cols="8">
                    <v-container class="max-width">
                        <v-pagination
                            v-model="page"
                            :length="paginationInfo.numberOfPages"
                            class="my-4"
                            color="indigo"
                            @click="$emit('changePage', page)"
                        ></v-pagination>
                    </v-container>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script setup>
const pageInfo = defineProps(["paginationInfo"]);

const page = ref(1);

defineEmits(["changePage"]);
</script>

<style lang="scss" scoped></style>
