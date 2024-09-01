<template>
    <div class="flex flex-col relative">
        <label class="flex items-center gap-1.5">
            <div class="flex gap-2 items-center input-base p-0">
                <div
                    class="relative border border-solid dark:border-primary border-lightGray w-5 h-5 rounded-sm flex justify-center items-center dark:text-gray-dark text-white"
                    :class="value == valueTrue ? 'bg-primary' : ''"
                >
                    <input
                        hidden
                        type="checkbox"
                        :checked="value == valueTrue"
                        :disabled="disabled"
                        @change="inputHandler"
                    />
                    <IconCheck width="16px" />
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
    label: {
        default: false,
    },
    error: {
        type: String,
        default: "",
    },
    valueTrue: {
        default: true,
    },
    valueFalse: {
        default: false,
    },
});

const value = defineModel();
const emit = defineEmits(["update:value"]);

const inputHandler = (e) => {
    const value = e.target.checked ? props.valueTrue : props.valueFalse;
    emit("update:modelValue", value);
};
</script>

<style lang="scss"></style>
