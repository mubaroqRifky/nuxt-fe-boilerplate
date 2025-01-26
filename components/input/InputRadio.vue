<template>
    <div class="flex flex-col relative">
        <label class="flex items-center gap-2">
            <div class="flex gap-2 items-center input-base p-0">
                <div
                    class="relative border-[1.5px] border-solid dark:border-primary w-5 h-5 rounded-full flex justify-center items-center dark:text-gray-dark text-white"
                    :class="[
                        error ? 'border-danger' : 'border-gray',
                        inputCheck?.checked ? 'bg-white border-primary' : '',
                        disabled ? 'bg-softGray' : '',
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
                        :class="[inputCheck?.checked ? 'bg-primary' : '']"
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
        required: true,
    },
});

const emit = defineEmits(["update:modelValue", "update:error", "input:change"]);

const inputValue = defineModel();
watch(inputValue, () => {
    emit("update:error");
});

const inputCheck = ref(null);
</script>

<style lang="scss"></style>
