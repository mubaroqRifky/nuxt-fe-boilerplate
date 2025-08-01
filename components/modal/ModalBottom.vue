<template lang="">
    <section
        class="fixed top-0 left-0 right-0 bottom-0 bg-transparent flex flex-col justify-end items-center z-50 mobile-width-constraint"
        @click.self.stop="closeHandler"
    >
        <Transition name="slideup">
            <div
                v-if="bodyShow"
                class="bg-white rounded-t-xl w-full px-6 py-6 grid gap-4 content-start text-center shadow_up relative max-w-md"
            >
                <button
                    ref="buttonStackModal"
                    class="absolute -top-12 right-2 bg-white rounded-full p-2 z-50"
                    @click="closeHandler"
                >
                    <IconClose />
                </button>

                <div
                    class="rounded-md h-32 w-full grid items-center justify-center"
                >
                    <IconSuccess width="100px" v-if="type == MODAL.SUCCESS" />
                    <IconError width="100px" v-if="type == MODAL.ERROR" />
                    <IconWarning width="100px" v-if="type == MODAL.WARNING" />
                    <IconQuestion width="100px" v-if="type == MODAL.CONFIRM" />
                    <IconLogout
                        width="100px"
                        class="text-primary"
                        v-if="type == MODAL.LOGOUT"
                    />
                </div>

                <h2 class="font-bold text-elipsis elipsis-1">{{ content }}</h2>

                <p
                    class="text-center text-sm text-gray-dark text-elipsis elipsis-4"
                    :title="subcontent"
                    v-html="subcontent"
                    v-if="subcontent"
                ></p>

                <div
                    class="grid grid-cols-2 items-center justify-center gap-3 mt-2"
                    v-if="
                        (type == MODAL.CONFIRM || type == MODAL.LOGOUT) &&
                        !$slots.action
                    "
                >
                    <button class="btn btn-secondary" @click="closeHandler">
                        Kembali
                    </button>
                    <button class="btn btn-primary" @click="actionHandler">
                        Iya
                    </button>
                </div>

                <div
                    class="grid mt-2"
                    v-if="
                        (type == MODAL.SUCCESS ||
                            type == MODAL.ERROR ||
                            type == MODAL.WARNING) &&
                        !$slots.action
                    "
                >
                    <button class="btn btn-primary" @click="actionHandler">
                        Oke
                    </button>
                </div>

                <slot
                    name="action"
                    v-if="type == MODAL.CONFIRM || type == MODAL.LOGOUT"
                ></slot>
            </div>
        </Transition>
    </section>
</template>

<script setup>
const props = defineProps({
    loading: {
        type: Boolean,
        default: false,
    },
    type: {
        type: String,
        default: "success",
    },
    content: {
        type: String,
        default: "",
    },
    subcontent: {
        type: String,
        default: "",
    },
    btnConfirm: {
        default: "Iya",
    },
    btnCancel: {
        default: "Kembali",
    },
});

const emit = defineEmits(["close", "proses"]);
const bodyShow = ref(false);
const buttonStackModal = ref(false);

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
    if (props.loading) return;

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

const addStackModalClass = () => {
    const stackModal = [MODAL.SUCCESS, MODAL.ERROR, MODAL.WARNING];
    if (!stackModal.includes(props.type)) {
        buttonStackModal.value.classList.add("stack-modal");
    }
};

onMounted(async () => {
    document.body.addEventListener("keydown", closeModal);
    bodyShow.value = true;
    await nextTick();
    addStackModalClass();
});
</script>

<style lang="scss" scoped>
.shadow_up {
    box-shadow: 0px -1px 10px rgba(0, 0, 0, 0.2);
}
</style>
