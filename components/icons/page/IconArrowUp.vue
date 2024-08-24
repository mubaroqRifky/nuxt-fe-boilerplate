<template lang="">
    <span :style="styles" :class="className">
        <svg
            :style="{ width, height }"
            xmlns="http://www.w3.org/2000/svg"
            width="1.2rem"
            height="1.2rem"
            viewBox="0 0 20 20"
        >
            <path fill="currentColor" d="m11 7l-4 6h8z" />
        </svg>
    </span>
</template>

<script>
export default {
    props: ["width", "height", "styles", "className"],
};
</script>

<style lang=""></style>
