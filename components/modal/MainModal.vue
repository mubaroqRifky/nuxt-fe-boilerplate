<template>
    <div
        class="fixed top-0 left-0 right-0 bottom-0 bg-white-blur flex justify-center items-center z-50"
        @click.self.stop="closeHandler"
        @keyup.escape="closeHandler"
    >
        <div
            class="modal-body shadow-xl modal-glass relative flex flex-col justify-center px-5 md:px-4 py-5 pt-5"
        >
            <button
                class="absolute -top-2 -right-2 bg-danger dark:text-gray-dark text-white rounded-full p-1 text-xs"
                @click.stop="closeHandler"
                aria-label="Cancel"
            >
                <IconClose width="15px" height="15px" />
            </button>

            <div class="gap-4 flex flex-col">
                <div class="flex justify-center items-center">
                    <IconSuccess width="80px" v-if="type == MODAL.SUCCESS" />
                    <IconError width="80px" v-if="type == MODAL.ERROR" />
                    <IconWarning width="80px" v-if="type == MODAL.WARNING" />
                    <IconQuestion width="80px" v-if="type == MODAL.CONFIRM" />
                </div>

                <div class="grid gap-2 content-start">
                    <h2
                        v-if="content"
                        class="dark:text-white text-primary leading-5 font-semibold text-center max-w-sm mx-auto"
                    >
                        {{ content }}
                    </h2>

                    <p
                        v-if="subcontent"
                        class="text-center text-sm dark:text-white text-gray-dark text-elipsis elipsis-3"
                        :title="subcontent"
                    >
                        {{ subcontent }}
                    </p>
                </div>

                <div
                    class="w-full md:w-auto flex flex-col-reverse justify-center md:flex-row gap-3"
                    v-if="!$slots.action && type == MODAL.CONFIRM"
                >
                    <button
                        class="btn btn-secondary w-full md:w-36 justify-center"
                        @click.stop="closeHandler"
                        aria-label="Cancel"
                    >
                        {{ btnCancel }}
                    </button>
                    <button
                        class="btn btn-primary w-full md:w-36 justify-center gap-4"
                        @click.stop="actionHandler"
                        id="confirm_yes"
                        aria-label="Confirm"
                        :disabled="loading"
                    >
                        {{ btnConfirm }}
                        <BounceLoader
                            :loading="loading"
                            :color="'white'"
                            :size="'20px'"
                            class="absolute right-3"
                        ></BounceLoader>
                    </button>
                </div>

                <div
                    class="flex flex-col mt-4"
                    v-if="!$slots.action && type == MODAL.ERROR"
                >
                    <button
                        class="bg-primary text-white px-6 py-3 rounded-xl text-center"
                        @click.stop="actionHandler"
                        :disabled="loading"
                    >
                        Oke
                    </button>
                </div>

                <div v-if="$slots.action" class="grid w-full gap-4">
                    <slot name="action"></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
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

const closeHandler = () => {
    if (loading.value) return;

    emit("close");
    document.body.removeEventListener("keydown", closeModal);
};

const actionHandler = () => {
    emit("proses");
    closeHandler();
};

onMounted(() => {
    document.body.addEventListener("keydown", closeModal);
});
</script>

<style lang="scss" scoped>
.modal-body {
    @apply w-[85%] md:w-3/4 max-w-sm dark:bg-gray-dark bg-white border border-solid border-primary rounded-xl;

    .btn-close-modal {
        @apply bg-gray-dark text-white rounded-full p-1 w-6 h-6 flex justify-center items-center -top-2 -right-2 absolute;
    }
}
</style>
