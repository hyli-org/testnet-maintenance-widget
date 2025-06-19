<script setup lang="ts">
import { ref } from "vue";
import { declareCustomElement } from "./lib";
declareCustomElement();

const nodeUrl = ref("https://node.testnet.hyli.org");
</script>

<template>
    <div class="bg-blue-400 w-screen h-screen">
        <input type="text" v-model="nodeUrl" placeholder="Enter node URL" class="p-2 m-4 border rounded" />
        <maintenance-widget :nodeurl="nodeUrl"></maintenance-widget>
    </div>
</template>

<style scoped></style>
