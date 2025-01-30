<template>
    <MobileContainer title="Take Photo">
        <ScrollContainer>
            <div
                class="flex-1 min-h-52 max-h-52 bg-softGray flex justify-center items-center"
            >
                <img
                    v-if="photo_url"
                    :src="photo_url"
                    class="w-full h-full object-contain"
                />
                <div
                    v-else
                    class="w-full rounded-md text-lightGray flex justify-center items-center"
                >
                    <IconImage width="100px" height="100px" />
                </div>
            </div>

            <div class="flex flex-col">
                <ButtonPrimary text="Take Photo" @press="openCamera">
                    <template #icon>
                        <IconPhoto />
                    </template>
                </ButtonPrimary>
            </div>
        </ScrollContainer>

        <CameraMobile
            v-if="cameraopen"
            @close="closeCamera"
            @apply="applyCamera"
        />
    </MobileContainer>
</template>

<script setup>
definePageMeta({
    layout: "mobile",
    middleware: [],
});

const photo_url = ref(null);
const cameraopen = ref(false);
const openCamera = () => {
    cameraopen.value = true;
};
const closeCamera = () => {
    cameraopen.value = false;
};
const applyCamera = (blobFile) => {
    const imgSrc = URL.createObjectURL(blobFile);
    photo_url.value = imgSrc;
    closeCamera();
};
</script>

<style lang="scss"></style>
