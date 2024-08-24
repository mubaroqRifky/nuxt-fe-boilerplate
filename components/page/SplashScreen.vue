<template>
    <div
        class="fixed top-0 left-0 right-0 bottom-0 p-8 pt-16 bg-image mobile-width-constraint z-[100]"
    >
        <div
            class="w-40 flex gap-2 items-center absolute bottom-10 left-1/2 -translate-x-1/2"
        ></div>
    </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.bg-image {
    background-image: linear-gradient(to bottom, #ffffff00 50%, #ffffff 95%),
        url("~/assets/images/splash.png"),
        linear-gradient(to bottom, #fff 50%, #fff 90%);
    @apply bg-no-repeat bg-cover bg-center;
}
</style>
