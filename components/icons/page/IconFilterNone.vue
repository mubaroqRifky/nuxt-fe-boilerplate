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
                fill="currentColor"
                d="M19.79 5.61A.998.998 0 0 0 19 4H6.83l7.97 7.97zM2.81 2.81L1.39 4.22L10 13v6c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-2.17l5.78 5.78l1.41-1.41z"
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
