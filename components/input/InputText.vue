<template>
    <div class="flex flex-col relative">
        <label class="flex flex-col gap-1.5">
            <span
                v-if="label"
                class="text-xs"
                :class="theme == 'primary' ? '' : 'text-primary'"
            >
                {{ label }}
            </span>
            <template
                v-if="type == 'text' || type == 'search' || type == 'number'"
            >
                <input
                    :disabled="disabled"
                    :type="type"
                    class="text-sm w-full focus:outline-primaryTransparent outline-offset-[3px] border border-solid focus:border-primaryTransparent"
                    :class="[
                        theme == 'primary'
                            ? `bg-primaryLight border-primaryLight ${getPaddingPrimary} ${getRoundedPrimary}`
                            : `border-gray ${getPadding} ${getRounded}`,
                        disabled && 'bg-lightGray',
                        error && 'input-error',
                    ]"
                    :placeholder="placeholder"
                    v-model="value"
                    ref="input"
                    @change="handleInputChange"
                />
            </template>
            <template v-else-if="type == 'tel'">
                <input
                    :disabled="disabled"
                    :type="type"
                    class="text-sm w-full focus:outline-primaryTransparent outline-offset-[3px] border border-solid focus:border-primaryTransparent"
                    :class="[
                        theme == 'primary'
                            ? `bg-primaryLight border-primaryLight ${getPaddingPrimary} ${getRoundedPrimary}`
                            : `border-gray ${getPadding} ${getRounded}`,
                        disabled && 'bg-lightGray',
                        error && 'input-error',
                    ]"
                    :placeholder="placeholder"
                    :value="value"
                    ref="input"
                    @input="validationPhoneNumber"
                />
            </template>
            <template v-else-if="type == 'textarea'">
                <textarea
                    :disabled="disabled"
                    class="text-sm w-full focus:outline-primaryTransparent outline-offset-[3px] border border-solid focus:border-primaryTransparent"
                    :class="[
                        theme == 'primary'
                            ? `bg-primaryLight border-primaryLight ${getPaddingPrimary} ${getRoundedPrimary}`
                            : `border-gray ${getPadding} ${getRounded}`,
                        disabled && 'bg-lightGray',
                        error && 'input-error',
                    ]"
                    :placeholder="placeholder"
                    v-model="value"
                    rows="5"
                />
            </template>
        </label>
        <p v-if="!noValidity" class="text-danger text-[.7rem] mt-1 mx-1">
            {{ error || "&nbsp;" }}
        </p>
    </div>
</template>

<script setup>
const props = defineProps({
    type: {
        type: String,
        default: "text",
    },
    theme: {
        type: String,
        default: "",
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
    disabled: {
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
    size: {
        type: String,
        default: "normal",
    },
});

const value = defineModel();
const emit = defineEmits(["update:error", "update:modelValue", "input:change"]);
const input = ref(null);

defineExpose({ input });

const getPaddingPrimary = computed(() => {
    switch (props.size) {
        case "small":
            return "px-3 py-2";
        case "extra-small":
            return "px-3 py-1.5 text-xs";
        default:
            return "px-5 py-3.5";
    }
});
const getRoundedPrimary = computed(() => {
    if (props.rounded) return "rounded-full";
});

const getPadding = computed(() => {
    switch (props.size) {
        case "small":
            return "px-3 py-2";
        case "extra-small":
            return "px-3 py-1.5 text-xs";
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

const validationPhoneNumber = (e) => {
    const { target } = e;
    const regex = new RegExp("[0-9]");

    if (e.data && !regex.test(e.data)) target.value = value.value;
    else emit("update:modelValue", target.value);
};

const handleInputChange = (e) => {
    emit("input:change", e);
};
</script>

<style lang="scss" scoped>
.input-error {
    border-color: red !important;
    outline-color: #ff000038 !important;
    background: #ff00000d !important;
}
</style>
