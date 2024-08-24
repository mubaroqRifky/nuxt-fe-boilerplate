<template>
    <div class="relative overflow-hidden flex flex-col h-full flex-1">
        <HeaderMobile v-if="header" :theme="theme" :title="title" />
        <slot></slot>
    </div>
</template>

<script setup>
const props = defineProps({
    header: {
        type: Boolean,
        default: true,
    },
    theme: {
        type: String,
        default: "default",
    },
    title: {
        type: String,
    },
});
</script>

<style lang=""></style>
