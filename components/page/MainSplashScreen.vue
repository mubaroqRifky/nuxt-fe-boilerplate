<template>
    <div
        class="fixed top-0 left-0 right-0 bottom-0 p-8 pt-16 z-[1000] bg-primary"
    >
        <div
            class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
            <BounceLoader :color="'white'" :size="'100px'"></BounceLoader>
        </div>
        <div
            class="absolute top-0 left-0 -z-10 flex h-full w-full items-center justify-between space-x-5 md:space-x-8 lg:space-x-14"
        >
            <div
                class="h-full w-1/3 bg-gradient-to-t from-[#FFFFFF14] to-[#C4C4C400]"
            ></div>
            <div class="flex h-full w-1/3">
                <div
                    class="h-full w-1/2 bg-gradient-to-b from-[#FFFFFF14] to-[#C4C4C400]"
                ></div>
                <div
                    class="h-full w-1/2 bg-gradient-to-t from-[#FFFFFF14] to-[#C4C4C400]"
                ></div>
            </div>
            <div
                class="h-full w-1/3 bg-gradient-to-b from-[#FFFFFF14] to-[#C4C4C400]"
            ></div>
        </div>
    </div>
</template>

<script setup></script>

<style lang="scss"></style>
