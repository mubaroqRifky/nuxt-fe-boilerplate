<template>
    <div class="flex flex-col relative h-full">
        <label class="flex flex-col gap-1 flex-1">
            <span v-if="label" class="text-xs text-primary">
                {{ label }} <i v-if="required" class="text-danger text-xs">*</i>
            </span>

            <template
                v-if="
                    type == 'text' ||
                    type == 'search' ||
                    type == 'number' ||
                    type == 'time'
                "
            >
                <input
                    :disabled="disabled"
                    :type="type"
                    class="input-text default"
                    :class="[disabled && 'disabled', error && 'input-error']"
                    :placeholder="placeholder"
                    v-model="value"
                    :min="min"
                    :max="max"
                    ref="input"
                    @wheel="wheelHandler"
                    @change="handleInputChange"
                />
            </template>

            <template v-else-if="type == 'tel'">
                <input
                    :disabled="disabled"
                    :type="type"
                    class="input-text default"
                    :class="[disabled && 'disabled', error && 'input-error']"
                    :placeholder="placeholder"
                    :value="value"
                    ref="input"
                    @input="validationPhoneNumber"
                    @change="handleInputChange"
                />
            </template>

            <template v-else-if="type == 'currency'">
                <input
                    :disabled="disabled"
                    :type="'text'"
                    class="input-text default"
                    :class="[disabled && 'disabled', error && 'input-error']"
                    inputmode="numeric"
                    :placeholder="placeholder"
                    :value="displayValue"
                    ref="input"
                    @input="handleInputCurrency"
                    @change="handleInputChange"
                />
            </template>

            <template v-else-if="type == 'textarea'">
                <textarea
                    :disabled="disabled"
                    class="input-text default max-h-52"
                    :class="[disabled && 'disabled', error && 'input-error']"
                    :placeholder="placeholder"
                    v-model="value"
                    rows="5"
                />
            </template>
        </label>

        <p v-if="!noValidity" class="text-danger text-[.7rem] mt-1 mx-1 flex-1">
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
    min: {
        default: "",
    },
    max: {
        default: "",
    },
});

const value = defineModel();
const displayValue = ref(value.value);

if (value.value && props.type == "currency") {
    displayValue.value = formatNumberToCurrency(value.value);
}

const emit = defineEmits(["update:error", "update:modelValue", "input:change"]);
const input = ref(null);

defineExpose({ input });

watch(value, (newValue) => {
    if (props.type == "currency") {
        displayValue.value = formatNumberToCurrency(newValue);
    }

    emit("update:error");
});

const validationPhoneNumber = (e) => {
    const { target } = e;
    const regex = new RegExp("[0-9]");

    if (e.data && !regex.test(e.data)) target.value = value.value || "";
    else emit("update:modelValue", target.value);
};

const handleInputCurrency = (e) => {
    let value = e.target.value;
    value = formatInputCurrency(value);
    e.target.value = value;

    if (props.min) validateMinimumValue(value);
    if (props.max) validateMaximumValue(value);

    displayValue.value = value;
    const valueNumber = formatCurrencyToNumber(value);

    emit("update:modelValue", valueNumber);
    emit("input:change", e);
};

const handleInputChange = (e) => {
    const { target } = e;

    if (props.min) validateMinimumValue(target.value);
    if (props.max) validateMaximumValue(target.value);

    emit("input:change", e);
};

const wheelHandler = (e) => {
    if (props.type == "number") e.preventDefault();
};

const validateMinimumValue = (value) => {
    if (value < props.min) {
        const message = `Nilai tidak boleh kurang dari ${props.min}`;
        emit("update:error", message);
    }
};

const validateMaximumValue = (value) => {
    if (props.type == "currency") {
        value = formatInputCurrencyToNumber(value);
    }

    if (value > props.max) {
        const message = `Nilai tidak boleh lebih dari ${props.max}`;
        emit("update:error", message);
    }
};
</script>

<style lang="scss" scoped>
.input-text {
    @apply border border-solid px-3 pr-1 py-2.5 text-xs flex items-center outline-offset-[3px] focus:outline-primaryTransparent focus:border-primaryTransparent;

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
