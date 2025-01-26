<template lang="">
    <span :style="styles" :class="className">
        <svg
            :style="{ width, height }"
            width="12"
            height="13"
            viewBox="0 0 12 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M2.81925 12.4174C2.46925 12.4174 2.16973 12.2929 1.9207 12.0439C1.67167 11.7949 1.54694 11.4951 1.54652 11.1447V2.87198H0.910156V1.59925H4.09197V0.962891H7.91016V1.59925H11.092V2.87198H10.4556V11.1447C10.4556 11.4947 10.3311 11.7944 10.0821 12.0439C9.83303 12.2933 9.53331 12.4179 9.18288 12.4174H2.81925ZM4.09197 9.87198H5.3647V4.14471H4.09197V9.87198ZM6.63743 9.87198H7.91016V4.14471H6.63743V9.87198Z"
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
