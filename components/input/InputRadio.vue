<template>
    <div class="flex flex-col relative">
        <label class="flex items-center gap-2">
            <div class="flex gap-2 items-center input-base p-0">
                <div
                    class="relative border-[1.5px] border-solid dark:border-primary w-5 h-5 rounded-full flex justify-center items-center dark:text-gray-dark text-white"
                    :class="[
                        error ? 'border-danger' : 'border-gray',
                        value == valueModel ? 'bg-white border-primary' : '',
                    ]"
                >
                    <input
                        hidden
                        type="radio"
                        :name="name"
                        :value="value"
                        :disabled="disabled"
                        v-model="valueModel"
                        @change="inputHandler"
                    />
                    <div
                        class="w-2 h-2 rounded-full"
                        :class="[value == valueModel ? 'bg-primary' : '']"
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

const valueModel = defineModel();
const emit = defineEmits(["update:value", "update:error", "input:change"]);

const inputHandler = (e) => {
    emit("update:error");
    emit("input:change");
};
</script>

<style lang="scss"></style>
