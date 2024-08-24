<template>
    <MobileContainer title="Page Two">
        <ScrollContainer> </ScrollContainer>
    </MobileContainer>
</template>
<script setup>
definePageMeta({
    layout: "mobile",
    middleware: ["auth"],
    bottomNavigation: true,
});
</script>

<style lang="scss"></style>
