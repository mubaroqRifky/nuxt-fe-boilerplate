<template lang="">
    <span :style="styles" :class="className">
        <svg
            :style="{ width, height }"
            width="14"
            height="13"
            viewBox="0 0 14 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M6.28434 9.67662V3.12846L4.19536 5.21744L3.07052 4.05243L7.0878 0.0351562L11.1051 4.05243L9.98024 5.21744L7.89125 3.12846V9.67662H6.28434ZM2.26707 12.8904C1.82517 12.8904 1.44701 12.7332 1.13259 12.4188C0.818169 12.1044 0.660692 11.726 0.660156 11.2835V8.87316H2.26707V11.2835H11.9085V8.87316H13.5154V11.2835C13.5154 11.7254 13.3582 12.1039 13.0438 12.4188C12.7294 12.7338 12.351 12.891 11.9085 12.8904H2.26707Z"
                fill="currentColor"
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
