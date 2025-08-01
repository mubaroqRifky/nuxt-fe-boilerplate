<template>
    <div class="flex flex-col relative">
        <label class="flex items-center gap-2">
            <div class="flex gap-2 items-center input-base p-0">
                <div
                    class="relative border-[1.5px] border-solid dark:border-primary w-5 h-5 rounded-full flex justify-center items-center dark:text-gray-dark text-white"
                    :class="[
                        error ? 'border-danger input-error' : 'border-gray',
                        inputValue == value
                            ? truthy
                                ? 'bg-white border-primary'
                                : 'bg-white border-red'
                            : '',
                        disabled ? 'bg-softGray' : 'bg-white',
                    ]"
                >
                    <input
                        ref="inputCheck"
                        hidden
                        type="radio"
                        :value="value"
                        :name="name"
                        v-model="inputValue"
                        :disabled="disabled"
                    />
                    <div
                        class="w-2 h-2 rounded-full"
                        :class="[
                            inputValue == value
                                ? truthy
                                    ? 'bg-primary'
                                    : 'bg-danger'
                                : '',
                        ]"
                    ></div>
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
    truthy: {
        type: Boolean,
        default: true,
    },
    label: {
        default: false,
    },
    name: {
        default: "name",
    },
    error: {
        type: String,
        default: "",
    },
    value: {
        default: "On",
    },
});

const emit = defineEmits(["update:modelValue", "update:error", "input:change"]);

const inputValue = defineModel();
watch(inputValue, (newValue) => {
    emit("update:error");

    if (props.value == newValue && inputCheck.value) {
        // inputCheck.value.checked = true;
    }
});

const inputCheck = ref(null);
</script>

<style lang="scss"></style>
