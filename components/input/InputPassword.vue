<template>
    <div class="flex flex-col relative">
        <label class="flex flex-col gap-1">
            <span v-if="label" class="text-xs text-primary">
                {{ label }} <i v-if="required" class="text-danger text-xs">*</i>
            </span>

            <div class="relative">
                <input
                    :disabled="disabled"
                    type="password"
                    class="input-password default"
                    :class="[disabled && 'disabled', error && 'input-error']"
                    :placeholder="placeholder"
                    v-model="value"
                />

                <button
                    tabindex="-1"
                    class="absolute right-2 cursor-pointer hover:text-primary transform top-1/2 -translate-y-1/2 z-10"
                    @click.stop="showPasswordHandler"
                    aria-label="Button Show Password"
                >
                    <IconShowPassword
                        v-if="show_password"
                        width="25px"
                        height="25px"
                        class="pointer-events-none"
                    />
                    <IconClosePassword
                        v-else
                        width="25px"
                        height="25px"
                        class="pointer-events-none"
                    />
                </button>
            </div>
        </label>

        <p v-if="!noValidity" class="text-danger text-[.7rem] mt-1.5 mx-1">
            {{ error || "&nbsp;" }}
        </p>
    </div>
</template>

<script setup>
const props = defineProps({
    label: {
        type: String,
        default: "",
    },
    labelColor: {
        type: String,
        default: "",
    },
    placeholder: {
        type: String,
        default: "",
    },
    error: {
        type: String,
        default: "",
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    required: {
        type: Boolean,
        default: false,
    },
    noValidity: {
        type: Boolean,
        default: false,
    },
    rounded: {
        type: Boolean,
        default: true,
    },
});

const value = defineModel();
const emit = defineEmits(["update:error"]);

watch(
    () => value,
    () => emit("update:error"),
    { deep: true }
);

const show_password = ref(false);

const showPasswordHandler = (e) => {
    try {
        const { target } = e;
        const inputPassword = target.previousElementSibling;

        if (!inputPassword) return;

        if (inputPassword.type === "password") {
            show_password.value = true;
            inputPassword.type = "text";
        } else {
            show_password.value = false;
            inputPassword.type = "password";
        }
    } catch (error) {
        console.error(error);
    }
};
</script>

<style lang="scss" scoped>
.input-password {
    @apply w-full border border-solid px-3 pr-10 py-2.5 text-xs flex items-center outline-offset-[3px] focus:outline-primaryTransparent focus:border-primaryTransparent;

    &.primary {
        @apply bg-primaryLight border-primaryLight placeholder:text-primaryDark text-primaryDark rounded-md;

        &.disabled {
            @apply bg-lightGray border-lightGray rounded-md;
        }
    }

    &.default {
        @apply border-gray bg-white rounded-xl;

        &.disabled {
            @apply bg-lightGray border-lightGray rounded-md;
        }
    }

    input {
        @apply w-full outline-none cursor-pointer p-0.5 pr-6 bg-[inherit];
    }
}

.input-error {
    border-color: red !important;
    outline-color: #ff000038 !important;
    background: #ff00000d !important;

    @apply placeholder:text-danger;
}
</style>
