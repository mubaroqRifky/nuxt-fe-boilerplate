<template>
    <section class="mobile-container mobile-width-constraint scroll-hidden">
        <slot> </slot>
        <FooterMobile v-if="$route.meta.bottomNavigation" />
        <LazySplashScreen v-if="splash_show" />
        <Transition name="ghost">
            <LazyModalBottom
                v-if="modal.show"
                :content="modal.content"
                :subcontent="modal.subcontent"
                :type="modal.type"
                @close="Modal.close"
                @proses="Modal.onconfirm"
            />
        </Transition>
        <Transition name="ghost">
            <LazyLoadingProses v-if="loading" />
        </Transition>
    </section>
</template>

<script setup>
const splash_show = ref(true);
const modal = Modal.getModal;

onMounted(() => {
    setTimeout(() => {
        splash_show.value = false;
    }, 2000);
});
</script>

<style lang="scss" scoped>
.mobile-container {
    @apply flex flex-col overflow-auto h-[100dvh] bg-white z-0;
}
</style>
