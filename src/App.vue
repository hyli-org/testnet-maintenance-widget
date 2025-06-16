<script setup lang="ts">
import { ref } from "vue";

const toto = ref(false);
setTimeout(() => {
    toto.value = true;
}, 3000);
</script>

<template>
    <div class="bg-blue-400 w-screen h-screen">
        <maintenance-widget :showHeavyLoad="toto"></maintenance-widget>
    </div>
</template>

<style scoped></style>
