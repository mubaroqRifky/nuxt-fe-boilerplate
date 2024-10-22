<template>
    <section
        class="mobile-width-constraint fixed top-0 left-0 right-0 bottom-0 bg-blur flex justify-center items-center z-40 stack-modal"
        @click.self.stop="closeHandler"
    >
        <Transition name="fade">
            <div
                v-if="bodyShow"
                class="modal-body relative shadow-xl flex flex-col justify-center px-5 md:px-4 py-5 pt-5"
            >
                <button
                    class="absolute -top-8 -right-6 bg-white dark:text-gray-dark rounded-full p-2 text-xs"
                    @click.stop="closeHandler"
                    aria-label="Cancel"
                >
                    <IconClose width="15px" height="15px" />
                </button>

                <div class="gap-4 flex flex-col">
                    <div>
                        <h2 class="font-semibold text-sm">Form Input</h2>
                    </div>

                    <div class="min-h-52">
                        <slot></slot>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4 mt-6">
                    <button
                        @click="closeHandler"
                        class="btn-secondary px-6 py-3 rounded-xl text-center"
                    >
                        Batal
                    </button>
                    <button
                        @click="actionHandler"
                        class="bg-primary text-white px-6 py-3 rounded-xl text-center"
                    >
                        Simpan
                    </button>
                </div>
            </div>
        </Transition>
    </section>
</template>

<script setup>
const props = defineProps({});
const emit = defineEmits(["close", "proses"]);

const closeModal = (e) => {
    if (e.key == "Escape") closeHandler();
};

const closeHandler = () => {
    if (props.loading) return;

    bodyShow.value = false;
    setTimeout(() => {
        emit("close");
    }, 200);
};

const actionHandler = () => {
    emit("proses");
};

const bodyShow = ref(false);

onMounted(() => {
    bodyShow.value = true;
});
</script>

<style lang="scss" scoped>
.modal-body {
    @apply w-[85%] md:w-3/4 max-w-2xl dark:bg-gray-dark bg-white rounded-xl;
}
</style>
