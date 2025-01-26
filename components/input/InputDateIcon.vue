<template>
    <div class="flex flex-col relative">
        <label class="flex flex-col gap-1.5">
            <Datepicker
                class="text-[.8rem] date-icon"
                :class="value?.length ? 'date-selected' : ''"
                :position="position"
                :year-picker="yearPicker"
                :format="format"
                :preview-format="format"
                :enable-time-picker="enableTimePicker"
                :day-names="['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']"
                :disabled="disabled"
                :placeholder="placeholder"
                v-model="value"
                ref="input"
                :month-picker="monthPicker"
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
        default: "small",
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
const emit = defineEmits(["update:error", "update:modelValue", "cleared"]);
const input = ref(null);

defineExpose({
    input,
});

watch(
    () => value,
    () => emit("update:error"),
    { deep: true }
);
</script>

<style lang="scss">
.dp__main {
    &.date-icon {
        .dp__input {
            @apply border-none p-0 w-12 text-xs text-primary font-semibold;
        }
    }

    &.date-selected {
        .dp__input {
            @apply border-none p-0 w-fit text-xs text-primary font-semibold;
        }

        svg {
            &.dp__input_icon,
            &.dp__clear_icon {
                display: none;
            }
        }
    }
}
</style>
