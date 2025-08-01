<template>
    <section class="mobile-container mobile-width-constraint scroll-hidden">
        <slot> </slot>
        <FooterMobile v-if="$route.meta.bottomNavigation" />
        <SplashScreen v-if="splash_show" />
        <Transition name="ghost">
            <ModalBottom
                v-if="modal.show"
                :content="modal.content"
                :subcontent="modal.subcontent"
                :type="modal.type"
                @close="closeModalHandler"
                @proses="confirmModalHandler"
            />
        </Transition>
        <Transition name="ghost">
            <LoadingProses v-if="loading" />
        </Transition>
    </section>
</template>

<script setup>
const splash_show = ref(true);
const modal = Modal.getModal;

const closeModalHandler = () => {
    Modal.close();
};

const confirmModalHandler = () => {
    setTimeout(() => {
        Modal.onconfirm();
    }, 250);
};

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
