<template>
    <div class="flex flex-col relative">
        <label class="flex items-center gap-1.5">
            <div class="flex gap-2 items-center bg-white input-base p-0">
                <div
                    class="relative border-[1.5px] border-solid dark:border-primary w-5 h-5 rounded-sm flex justify-center items-center dark:text-gray-dark text-white"
                    :class="[
                        error ? 'border-danger' : 'border-lightGray',
                        inputCheck?.checked ? 'bg-primary' : '',
                        disabled ? 'bg-softGray text-softGray' : '',
                    ]"
                >
                    <input
                        ref="inputCheck"
                        hidden
                        type="checkbox"
                        :value="value"
                        :true-value="valueTrue"
                        :false-value="valueFalse"
                        v-model="inputValue"
                        :disabled="disabled"
                    />
                    <IconCheck width="16px" />
                </div>
            </div>
            <span
                v-if="label"
                class="text-xs"
                :class="[
                    error
                        ? 'text-danger'
                        : theme == 'primary'
                        ? 'text-primary'
                        : '',
                ]"
            >
                {{ label }}
            </span>
        </label>

        <p v-if="!noValidity" class="text-danger text-[.7rem] mt-1 mx-1 flex-1">
            {{ error || "&nbsp;" }}
        </p>
    </div>
</template>

<script setup>
const props = defineProps({
    noValidity: {
        type: Boolean,
        default: false,
    },
    theme: {
        default: "default",
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    label: {
        default: false,
    },
    error: {
        type: String,
        default: "",
    },
    value: {
        default: "on",
    },
    valueTrue: {
        default: true,
    },
    valueFalse: {
        default: false,
    },
    multiple: {
        type: Boolean,
        default: false,
    },
});

const inputValue = defineModel();
const emit = defineEmits(["update:modelValue", "update:error"]);

watch(inputValue, () => {
    emit("update:error");
});

watch(
    () => props.modelValue,
    (newValue) => {
        inputValue.value = newValue;

        if (!props.multiple && newValue && inputCheck.value.value) {
            inputCheck.value.checked = newValue;
        }
    }
);

const inputCheck = ref(null);
</script>

<style lang="scss"></style>
