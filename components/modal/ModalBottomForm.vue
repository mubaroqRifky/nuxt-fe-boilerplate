<template>
    <section
        ref="modalContainer"
        class="fixed top-0 left-0 right-0 bottom-0 flex flex-col justify-end items-center z-40 mobile-width-constraint stack-modal"
        :class="[!fullScreen ? 'bg-transparent' : 'bg-blur']"
        @click.self.stop="closeHandler"
    >
        <Transition name="slideup">
            <div
                v-if="bodyShow"
                class="bg-white w-full flex flex-col shadow_up relative max-w-md"
                :class="[
                    fullScreen ? 'h-[100dvh]' : 'max-h-[90dvh] rounded-t-xl',
                ]"
            >
                <button
                    v-if="!fullScreen"
                    class="absolute -top-12 right-2 bg-white rounded-full p-2 z-10"
                    @click="closeHandler"
                >
                    <IconClose />
                </button>

                <div
                    v-if="title"
                    class="border-b border-solid border-lightGray px-6 py-4 shadow-sm flex gap-4 items-center"
                >
                    <button
                        v-if="fullScreen"
                        @click="closeHandler"
                        aria-label="Button Back"
                        class="rotate-180"
                    >
                        <IconArrow width="25" height="25" />
                    </button>

                    <div>
                        <h2
                            class="font-medium"
                            :class="fullScreen ? 'text-base' : 'text-sm'"
                        >
                            {{ title }}
                        </h2>
                        <h2 class="text-xs text-darkGray" v-if="subtitle">
                            {{ subtitle }}
                        </h2>
                    </div>
                </div>

                <div
                    :class="[classContainer]"
                    class="overflow-auto z-10 scroll-hidden flex-1"
                >
                    <slot></slot>
                </div>

                <slot name="action"></slot>

                <div
                    v-if="!$slots.action"
                    class="grid grid-cols-2 items-center justify-center gap-3 px-4 py-4 border-t border-solid border-lightGray"
                >
                    <button class="btn btn-secondary" @click="secondHandler">
                        {{ cancelText }}
                    </button>
                    <button class="btn btn-primary" @click="actionHandler">
                        {{ actionText }}
                    </button>
                </div>
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
        default: "px-4 py-4 min-h-32",
    },
    fullScreen: {
        type: Boolean,
        default: false,
    },
    actionText: {
        default: "Simpan",
    },
    cancelText: {
        default: "Batal",
    },
    actionCancel: {
        default: null,
    },
});

const emit = defineEmits(["close", "proses"]);
const bodyShow = ref(false);
const modalContainer = ref(false);

defineExpose({ modalContainer });

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

const secondHandler = () => {
    if (props.actionCancel && typeof props.actionCancel == "function") {
        props.actionCancel();
    } else {
        closeHandler();
    }
};

const actionHandler = () => {
    emit("proses");
};

onMounted(() => {
    document.body.addEventListener("keydown", closeModal);
    bodyShow.value = true;
});
</script>

<style lang="scss" scoped>
.shadow_up {
    box-shadow: 0px -1px 10px rgba(0, 0, 0, 0.2);
}
</style>
