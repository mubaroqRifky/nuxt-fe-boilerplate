<template lang="">
    <button
        class="px-4 py-4 rounded-4xl text-white uppercase"
        :class="disabled ? 'bg-gray' : 'bg-primary'"
        aria-label="Button Main"
        @click.prevent.stop="$emit('press')"
    >
        {{ text }}
    </button>
</template>
<script>
export default {
    emits: ["press"],
    props: {
        text: {
            type: String,
            default: "None",
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
};
</script>
<style lang=""></style>
