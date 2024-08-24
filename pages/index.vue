<template>
    <MobileContainer title="Page One">
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
