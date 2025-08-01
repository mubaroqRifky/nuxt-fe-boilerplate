<template>
    <div class="flex flex-col relative">
        <label class="flex flex-col gap-1">
            <span v-if="label" class="text-xs text-primary">
                {{ label }} <i v-if="required" class="text-danger text-xs">*</i>
            </span>

            <Datepicker
                class="input-default"
                :class="[disabled && 'disabled', error && 'input-error']"
                :position="position"
                :format="format"
                :preview-format="format"
                :enable-time-picker="enableTimePicker"
                :day-names="['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']"
                :disabled="disabled"
                :placeholder="placeholder"
                v-model="displayValue"
                ref="input"
                :month-picker="monthPicker"
                :year-picker="yearPicker"
                :disable-year-select="disableYearSelect"
                :min-date="minDate"
                :max-date="maxDate"
                :auto-apply="autoApply"
                :auto-position="autoPosition"
                :alt-position="altPosition"
                :teleport-center="teleportCenter"
                :teleport="teleport"
                :time-picker-inline="timePickerInline"
                locale="id-ID"
                :range="range"
                @cleared="$emit('cleared')"
            />
        </label>
        <p v-if="!noValidity" class="text-danger text-[.7rem] mt-1 mx-1 flex-1">
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
    format: {
        type: String,
        default: "dd/MM/yyyy",
    },
    monthPicker: {
        type: Boolean,
        default: false,
    },
    disableYearSelect: {
        type: Boolean,
        default: false,
    },
    yearPicker: {
        type: Boolean,
        default: false,
    },
    minDate: {
        type: [Date, String],
        default: null,
    },
    maxDate: {
        type: [Date, String],
        default: null,
    },
    startTime: {
        default: null,
    },
    minTime: {
        default: null,
    },
    maxTime: {
        default: null,
    },
    position: {
        default: "center",
    },
    altPosition: {
        default: null,
    },
    autoPosition: {
        type: Boolean,
        default: true,
    },
    teleportCenter: {
        type: Boolean,
        default: false,
    },
    dateTime: {
        type: Boolean,
        default: false,
    },
    enableTimePicker: {
        type: Boolean,
        default: false,
    },
    timePickerInline: {
        type: Boolean,
        default: true,
    },
    autoApply: {
        type: Boolean,
        default: false,
    },
    teleport: {
        default: null,
    },
    multiple: {
        type: Boolean,
        default: false,
    },
    min: {
        default: "",
    },
    max: {
        default: "",
    },
    range: {
        type: Boolean,
        default: false,
    },
});

const value = defineModel();
const displayValue = ref(value.value);
const emit = defineEmits(["update:error", "update:modelValue", "cleared"]);
const input = ref(null);

defineExpose({
    input,
});

watch(value, () => {
    displayValue.value = value.value;
    emit("update:error");
});

watch(displayValue, (newValue) => {
    let formatValue = newValue;

    if (props.enableTimePicker || props.dateTime) {
        if (props.range) {
            const resultValue = [];
            newValue.forEach((val) => {
                resultValue.push(formatDefaultDateTime(val));
            });
            formatValue = resultValue;
        } else {
            formatValue = formatDefaultDateTime(newValue);
        }
    } else if (!props.yearPicker) {
        if (props.range) {
            const resultValue = [];
            newValue.forEach((val) => {
                resultValue.push(formatDefaultDate(val));
            });
            formatValue = resultValue;
        } else {
            formatValue = formatDefaultDate(newValue);
        }
    }

    emit("update:modelValue", formatValue);
});
</script>

<style lang="scss">
.dp__main {
    .dp__input {
        @apply border border-solid;
    }

    .dp__tp_inline_btn_top {
        height: 1rem;
        .dp__tp_btn_in_l {
            transform: rotate(-25deg) scale(1.15) translateY(2px);
        }
        .dp__tp_btn_in_r {
            transform: rotate(25deg) scale(1.15) translateY(2px);
        }
    }

    .dp__tp_inline_btn_bottom {
        height: 1rem;
        .dp__tp_btn_in_l {
            transform: rotate(25deg) scale(1.15) translateY(-2px);
        }
        .dp__tp_btn_in_r {
            transform: rotate(-25deg) scale(1.15) translateY(-2px);
        }
    }

    &.input-error {
        input {
            border-color: red !important;
            outline-color: #ff000038 !important;
            background: #ff00000d !important;
            &::placeholder {
                color: red !important;
            }
        }
    }

    &.input-default {
        @apply text-[.8rem] w-full;

        .dp__input {
            @apply placeholder:text-sm border-gray rounded-xl px-5 py-1.5 pl-8;
        }

        &.disabled {
            .dp__disabled {
                @apply bg-lightGray border-lightGray rounded-md;
            }
        }

        &.input-error {
            .dp__input_icon {
                @apply text-danger;
            }
        }
    }
}
</style>
