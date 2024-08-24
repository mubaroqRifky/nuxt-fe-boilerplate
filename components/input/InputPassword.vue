<template>
    <div class="flex flex-col relative">
        <label class="flex flex-col gap-1">
            <span class="text-xs" v-if="label"> {{ label }} </span>
            <div class="relative">
                <input
                    type="password"
                    class="text-sm w-full focus:outline-primaryTransparent outline-offset-[3px] border border-solid focus:border-primaryTransparent"
                    :class="[
                        theme == 'primary'
                            ? `bg-primaryLight border-primaryLight ${getPaddingPrimary} ${getRoundedPrimary}`
                            : `border-gray ${getPadding} ${getRounded}`,
                        error && 'input-error',
                    ]"
                    :placeholder="placeholder"
                    v-model="value"
                />

                <button
                    tabindex="-1"
                    class="absolute text-primary right-4 cursor-pointer hover:text-primary transform top-1/2 -translate-y-1/2 z-20"
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
    theme: {
        type: String,
        default: "primary",
    },
    label: {
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
    noValidity: {
        type: Boolean,
        default: false,
    },
    rounded: {
        type: Boolean,
        default: true,
    },
    size: {
        type: String,
        default: "normal",
    },
});

const value = defineModel();
const emit = defineEmits(["update:error"]);

const getPaddingPrimary = computed(() => {
    switch (props.size) {
        case "small":
            return "px-3 py-2";
        default:
            return "px-5 pr-12 py-3.5";
    }
});
const getRoundedPrimary = computed(() => {
    if (props.rounded) return "rounded-full";
});

const getPadding = computed(() => {
    switch (props.size) {
        case "small":
            return "px-3 py-2";
        default:
            return "px-5 py-3";
    }
});
const getRounded = computed(() => {
    if (props.rounded) return "rounded-xl";
});

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
.input-error {
    border-color: red !important;
    outline-color: #ff000038 !important;
    background: #ff00000d !important;
}
</style>
