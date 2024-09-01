<template>
    <main class="overflow-hidden h-[100dvh] relative bg-[#eef8ff]">
        <NuxtLoadingIndicator />
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </main>
</template>

<style>
.page-enter-active,
.page-leave-active {
    transition: all 0.1s;
}
.page-enter-from,
.page-leave-to {
    opacity: 0;
    filter: blur(1rem);
}
</style>

<script setup>
const { InitialNotification } = useNotification();

onMounted(() => {
    InitialNotification();
});
</script>
