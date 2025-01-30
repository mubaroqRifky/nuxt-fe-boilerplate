<template>
    <button
        class="flex items-center justify-center gap-2 rounded-md whitespace-nowrap"
        :class="[getBackgroundStyle, getSizeStyle]"
        aria-label="Button Main"
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
        default: "default",
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    outline: {
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
        return "bg-white text-primaryDark border border-solid border-primaryDark";
    }

    return "bg-primaryDark text-white";
});

const getSizeStyle = computed(() => {
    const paddingX = props.text ? "px-3" : "px-2";
    switch (props.size) {
        case "small":
            return paddingX + " py-1.5 text-xs";
        default:
            return "px-4 py-2 text-sm";
    }
});
</script>
<style lang=""></style>
