<template>
    <div class="relative flex flex-col h-full flex-1 gap-6">
        <h1 class="font-semibold text-md text-primaryDark">Dashboard</h1>

        <section class="flex flex-col gap-8 pb-8"></section>
    </div>
</template>
<script setup>
definePageMeta({
    layout: "admin",
    middleware: ["auth", "admin"],
});
</script>

<style lang="scss"></style>
