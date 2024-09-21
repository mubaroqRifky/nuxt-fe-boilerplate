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
                d="M12 19q-2.925 0-4.962-2.037T5 12q0-2.925 2.038-4.962T12 5q2.925 0 4.963 2.038T19 12q0 2.925-2.037 4.963T12 19"
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
