<template>
    <section class="flex flex-col w-screen h-[100dvh]">
        <slot> </slot>

        <Transition name="ghost">
            <LazyMainModal
                v-if="modal.show"
                :content="modal.content"
                :subcontent="modal.subcontent"
                :type="modal.type"
                @close="Modal.close"
                @proses="Modal.onconfirm"
            />
        </Transition>
    </section>
</template>

<script setup>
const modal = Modal.getModal;
</script>

<style lang="scss" scoped></style>
