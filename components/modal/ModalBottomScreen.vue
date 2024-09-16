<template lang="">
    <section
        ref="modalContainer"
        class="fixed top-0 left-0 right-0 bottom-0 bg-transparent flex flex-col justify-end items-center z-40 mobile-width-constraint"
        @click.self.stop="closeHandler"
    >
        <Transition name="slideup">
            <div
                v-if="bodyShow"
                class="bg-white rounded-t-xl w-full grid content-start shadow_up relative max-w-md"
            >
                <button
                    class="absolute -top-12 right-2 bg-white rounded-full p-2 z-50"
                    @click="closeHandler"
                >
                    <IconClose />
                </button>

                <div
                    v-if="title"
                    class="border-b border-solid border-gray px-6 py-4 shadow-sm flex gap-4 items-center"
                >
                    <div>
                        <h2 class="font-semibold">
                            {{ title }}
                        </h2>
                        <h2 class="text-xs text-darkGray" v-if="subtitle">
                            {{ subtitle }}
                        </h2>
                    </div>
                </div>

                <div
                    class="overflow-auto max-h-[70dvh] z-10 scroll-hidden"
                    :class="classContainer"
                >
                    <slot></slot>
                </div>

                <slot name="action"></slot>
            </div>
        </Transition>
    </section>
</template>

<script setup>
const props = defineProps({
    title: {
        type: String,
        default: "",
    },
    subtitle: {
        type: String,
        default: "",
    },
    classContainer: {
        type: String,
        default: "px-6 py-6 min-h-32",
    },
});

const emit = defineEmits(["close", "proses"]);
const bodyShow = ref(false);
const modalContainer = ref(false);

const MODAL = {
    SUCCESS: "success",
    ERROR: "error",
    WARNING: "warning",
    CONFIRM: "confirm",
    LOGOUT: "logout",
};

const closeModal = (e) => {
    if (e.key == "Escape") closeHandler();
};

const timeout = ref(null);
const closeHandler = () => {
    bodyShow.value = false;
    clearTimeout(timeout.value);
    timeout.value = setTimeout(() => {
        emit("close");
        document.body.removeEventListener("keydown", closeModal);
    }, 250);
};

const actionHandler = () => {
    closeHandler();
    emit("proses");
};

onMounted(() => {
    document.body.addEventListener("keydown", closeModal);
    bodyShow.value = true;
    const stackModal = [MODAL.SUCCESS, MODAL.ERROR];
    if (!stackModal.includes(props.type)) {
        modalContainer.value.classList.add("modal-input");
    }
});
</script>

<style lang="scss" scoped>
.shadow_up {
    box-shadow: 0px -1px 10px rgba(0, 0, 0, 0.2);
}
</style>
