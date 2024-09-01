<template>
    <div class="flex flex-col relative">
        <label class="flex items-center gap-1.5">
            <div class="flex gap-2 items-center input-base p-0">
                <div
                    class="relative rounded-full border border-solid dark:border-primary border-darkGray w-5 h-5 flex justify-center items-center dark:text-gray-dark text-white"
                    :class="modelValue == value ? 'bg-primary' : ''"
                >
                    <input
                        hidden
                        type="radio"
                        :name="name"
                        :value="value"
                        :disabled="disabled"
                        v-model="modelValue"
                    />
                    <span
                        class="inline-block h-2 w-2 rounded-full bg-white"
                    ></span>
                </div>
            </div>
            <span
                v-if="label"
                class="text-xs"
                :class="theme == 'primary' ? '' : 'text-primary'"
            >
                {{ label }}
            </span>
        </label>

        <p v-if="!noValidity" class="text-danger text-[.7rem] mt-1 mx-1">
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
        default: "primary",
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    name: {
        default: "",
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
});

const modelValue = defineModel();
const emit = defineEmits(["update:modelValue"]);

const inputHandler = (e) => {
    const value = e.target.checked ? props.valueTrue : props.valueFalse;
    emit("update:modelValue", value);
};
</script>

<style lang="scss"></style>
