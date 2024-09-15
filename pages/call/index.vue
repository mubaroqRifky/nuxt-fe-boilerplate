<template>
    <MobileContainer :header="false">
        <HeaderMobile theme="default" title="Panggilan" />
        <ScrollContainer class="pt-2">
            <button
                class="shadow-md absolute right-4 rounded-md p-2 transition-all hover:bg-primary hover:text-white"
                style="bottom: 5rem"
            >
                <IconAddCall width="25px" height="25px" />
            </button>
        </ScrollContainer>
    </MobileContainer>
</template>
<script setup>
definePageMeta({
    layout: "mobile",
    middleware: ["auth"],
    bottomNavigation: true,
});

onMounted(() => {});
</script>

<style lang="scss"></style>
