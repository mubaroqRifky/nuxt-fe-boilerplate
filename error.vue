<template>
    <NuxtLayout name="error">
        <div class="relative w-screen h-[100dvh] p-8 pt-8 z-[1000] bg-primary">
            <section>
                <div class="container">
                    <div class="-mx-4 flex">
                        <div class="w-full px-4">
                            <div
                                class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-[90%]"
                            >
                                <h2
                                    class="mb-2 text-[50px] font-bold leading-none text-white sm:text-[80px] md:text-[100px]"
                                >
                                    {{ error.statusCode }}
                                </h2>
                                <h4
                                    class="mb-3 text-[22px] font-semibold leading-tight text-white"
                                >
                                    {{ getMessageError }}
                                </h4>
                                <p class="mb-8 text-lg text-white">
                                    {{ getSubMessage }}
                                </p>
                                <nuxt-link
                                    to="/"
                                    href="javascript:void(0)"
                                    class="inline-block rounded-lg border border-white px-8 py-3 text-center text-base font-semibold text-white transition hover:bg-white hover:text-primary"
                                >
                                    Go To Home
                                </nuxt-link>
                            </div>
                        </div>
                    </div>
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
            </section>
        </div>
    </NuxtLayout>
</template>

<script setup>
const props = defineProps({
    error: Object,
});

const getMessageError = computed(() => {
    switch (props.error.statusCode) {
        case 404:
            return "Oops! That page can’t be found";
        default:
            return "Oops! There is something wrong";
    }
});

const getSubMessage = computed(() => {
    switch (props.error.statusCode) {
        case 404:
            return "The page you are looking for it maybe deleted";
        default:
            return props.error.message;
    }
});
</script>

<style lang=""></style>
