<template lang="">
    <span :style="styles" :class="className">
        <svg
            :style="{ width, height }"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
        >
            <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m5 12l5 5L20 7"
            />
        </svg>
    </span>
</template>

<script>
export default {
    props: ["width", "height", "styles", "className"],
};
</script>

<style lang=""></style>
