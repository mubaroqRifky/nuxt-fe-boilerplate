<template>
    <button
        class="flex items-center justify-center gap-2 rounded-md whitespace-nowrap"
        :class="[
            getBackgroundStyle,
            getSizeStyle,
            rounded ? 'rounded-full' : 'rounded-md',
        ]"
        aria-label="Button Danger"
        :disabled="disabled"
        @click.prevent.stop="$emit('press')"
    >
        <slot v-if="$slots.icon" name="icon"></slot>
        {{ text }}
    </button>
</template>

<script setup>
const props = defineProps({
    text: {
        type: String,
        default: "",
    },
    size: {
        type: String,
        default: "small",
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    outline: {
        type: Boolean,
        default: false,
    },
    rounded: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(["press"]);

const getBackgroundStyle = computed(() => {
    if (props.disabled) {
        return "bg-gray cursor-not-allowed text-white";
    }

    if (props.outline) {
        return "bg-white text-danger border border-solid border-danger";
    }

    return "bg-danger text-white";
});

const getSizeStyle = computed(() => {
    const paddingX = props.text ? "px-3" : "px-2";
    switch (props.size) {
        case "small":
            return paddingX + " py-1.5 text-xs";
        case "normal":
            return "px-4 py-2 text-sm";
        default:
            return "px-4 py-3";
    }
});
</script>
<style lang=""></style>
