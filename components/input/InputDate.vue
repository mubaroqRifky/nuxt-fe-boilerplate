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

            <Datepicker
                class="text-sm w-full"
                :class="[
                    error && 'input-error',
                    size == 'small' && 'input-small',
                    theme == 'primary' ? 'input-primary' : 'input-default',
                ]"
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
    .dp__input {
        @apply border border-solid;
    }

    &.input-error {
        input {
            border-color: red !important;
            outline-color: #ff000038 !important;
            background: #ff00000d !important;
        }
    }

    &.input-primary {
        .dp__input {
            @apply bg-primaryLight border-primaryLight rounded-full px-5 py-3 pl-8;
        }

        &.input-small {
            .dp__input {
                @apply px-3 py-2 pl-8;
            }
        }
    }

    &.input-default {
        .dp__input {
            @apply border-gray rounded-xl px-5 py-2.5 pl-8;
        }

        &.input-small {
            .dp__input {
                @apply px-3 py-2 pl-8;
            }
        }
    }
}
</style>
