<template lang="">
    <span :style="styles" :class="className">
        <svg
            :style="{ width, height }"
            xmlns="http://www.w3.org/2000/svg"
            width="1.2rem"
            height="1.2rem"
            viewBox="0 0 24 24"
        >
            <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497zM15 5l4 4"
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
