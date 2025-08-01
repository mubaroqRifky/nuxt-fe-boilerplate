<template>
    <div
        class="flex flex-col h-full fixed top-0 left-0 right-0 bottom-0 z-40 mobile-width-constraint stack-screen"
    >
        <section class="bg-black flex flex-1 flex-col h-full relative">
            <div
                class="absolute z-40 flex justify-between items-center left-0 right-0"
                :class="hasImage ? 'bg-transparent' : ''"
            >
                <button
                    id="button-close"
                    class="text-white p-2"
                    @click="$emit('close')"
                >
                    <IconClose :bold="true" width="25px" height="25px" />
                </button>

                <label for="fileUploadImage" class="text-white p-2 flex">
                    <input
                        type="file"
                        class="hidden"
                        id="fileUploadImage"
                        @change="fileChangeHandler"
                        accept="image/*"
                    />

                    <button @click="uploadImageHandler">
                        <IconImage :bold="true" width="30px" height="30px" />
                    </button>
                </label>
            </div>

            <canvas class="photo hidden"></canvas>

            <audio class="snap" :src="snap" hidden></audio>

            <img
                v-show="hasImage"
                id="image"
                class="w-full h-full object-contain"
                :style="{
                    transform:
                        constraints.video.facingMode == 'user'
                            ? 'scaleX(-1)'
                            : 'scaleX(1)',
                }"
            />

            <video
                v-if="!hasImage"
                id="video"
                class="flex-1 w-full h-full object-cover"
            ></video>

            <div
                class="grid justify-center absolute bottom-0 p-6 left-0 right-0 justify-items-center items-center text-white z-40"
                :class="hasImage ? 'grid-cols-2 bg-transparent' : 'grid-cols-3'"
            >
                <button
                    v-if="!hasImage"
                    @click="reverseCameraHandler"
                    :disabled="cameraOpening"
                    class="cursor-pointer flex justify-center items-center w-12 h-12 p-2 rounded-full bg-transparent border border-white border-solid transform transition-all"
                    :class="cameraOpening ? 'rotate-180' : 'rotate-0'"
                >
                    <IconChangeCamera />
                </button>
                <button
                    v-if="!hasImage"
                    @click="onTakePhotoButtonClick"
                    :disabled="cameraOpening && hasError"
                    class="cursor-pointer w-16 h-16 flex justify-center items-center bg-white rounded-full outline-offset-4 outline outline-white hover:bg-whiteTransparent hover:outline-whiteTransparent transition-all"
                ></button>
                <button
                    v-if="!hasImage"
                    @click="turnFlashHandler"
                    :disabled="!hasTorch && cameraOpening"
                    class="cursor-pointer flex justify-center items-center w-12 h-12 p-2 rounded-full border border-white border-solid"
                    :class="
                        hasTorch
                            ? 'bg-transparent'
                            : 'bg-softGray text-darkGray'
                    "
                >
                    <IconFlash :flash="isTorch" />
                </button>

                <button
                    @click="restartCameraHandler"
                    v-if="hasImage"
                    class="cursor-pointer transition-all w-32 h-6 flex justify-center items-center rounded-sm outline-offset-4 outline outline-red text-red hover:bg-red hover:text-black"
                >
                    <IconClose :bold="true" width="20px" height="20px" />
                </button>
                <button
                    v-if="hasImage"
                    @click="$emit('apply', hasImage)"
                    class="cursor-pointer transition-all w-32 h-6 flex justify-center items-center rounded-sm outline-offset-4 outline outline-green-light text-green-light hover:bg-green-light hover:text-black"
                >
                    <IconApply width="20px" height="20px" />
                </button>
            </div>
        </section>
    </div>
</template>

<script setup>
useHead({
    meta: [
        { name: "theme-color", content: "black" },
        { name: "color-scheme", content: "light" },
    ],
});
</script>

<script>
import snap from "~/assets/audio/take-photo.mp3";

export default {
    data() {
        return {
            cameraOpening: false,
            imageCapture: null,
            hasTorch: false,
            videoStream: null,
            isTorch: false,
            hasImage: null,
            hasError: null,
            devices: {},
            constraints: {
                audio: false,
                video: {
                    width: { min: 1024, ideal: 1280, max: 1920 },
                    height: { min: 576, ideal: 720, max: 1080 },
                    facingMode: "",
                },
            },
            snap,
        };
    },
    components: {},
    methods: {
        clearStream() {
            if (this.videoStream) {
                this.videoStream.getTracks().forEach((track) => {
                    track.stop();
                });
            }
        },
        reverseCameraHandler() {
            const { facingMode } = this.constraints.video;
            const mode = facingMode == "user" ? "back" : "front";
            this.changeHandler(mode);
        },
        async changeHandler(mode = "back") {
            this.cameraOpening = true;
            let result = "user";
            const video = document.querySelector("#video");
            switch (mode) {
                case "back":
                    result = "environment";
                    video.style = "transform: scaleX(1)";
                    break;
                default:
                    result = "user";
                    video.style = "transform: scaleX(-1)";
                    break;
            }

            this.clearStream();

            this.constraints.video.facingMode = result;
            await this.startCamera();
            this.cameraOpening = false;
        },
        turnFlashHandler() {
            try {
                if (!this.hasTorch) return;

                const track = this.videoStream.getVideoTracks()[0];
                this.isTorch = !this.isTorch;
                track.applyConstraints({
                    advanced: [{ torch: this.isTorch }],
                });
            } catch (error) {
                throw new ErrorHandler(error);
            }
        },
        checkIsHasTorch() {
            const track = this.videoStream.getVideoTracks()[0];
            const trackCapabilities = track.getCapabilities();
            this.hasTorch = trackCapabilities.torch;
        },
        async hasFrontBack() {
            let result = {
                hasBack: false,
                hasFront: false,
                otherDevice: false,
                videoDevices: [],
            };
            try {
                let devices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = devices.filter((device) => {
                    if (device.kind === "videoinput") {
                        if (device.label && device.label.length > 0) {
                            if (
                                device.label.toLowerCase().indexOf("back") >= 0
                            ) {
                                result.hasBack = true;
                            } else if (
                                device.label.toLowerCase().indexOf("front") >= 0
                            ) {
                                result.hasFront = true;
                            } else {
                                result.otherDevice = true;
                            }
                        }
                        return true;
                    }
                    return false;
                });
                result.videoDevices = videoDevices;
                this.devices = result;
            } catch (error) {
                throw new ErrorHandler(error);
            }
        },
        fileChangeHandler(e) {
            const { target } = e;
            const blobFile = target.files[0];
            this.compressImageUpload(blobFile);
        },
        uploadImageHandler() {
            const imageElement = document.getElementById("fileUploadImage");
            if (imageElement) imageElement.click();
        },
        async onTakePhotoButtonClick() {
            try {
                this.canvasGetContext();
            } catch (error) {
                throw new ErrorHandler(error);
            }
        },
        playCaptureSound() {
            const snap = document.querySelector(".snap");
            snap.currentTime = 0;
            snap.play();
        },
        putDataBlobToImg(blobFile) {
            const image = document.getElementById("image");
            image.src = URL.createObjectURL(blobFile);
            this.hasImage = blobFile;
        },
        compressImageUpload(file) {
            const blobURL = URL.createObjectURL(file);
            const img = document.createElement("img");
            img.src = blobURL;

            img.onerror = () => {
                URL.revokeObjectURL(file);
            };
            img.onload = () => {
                URL.revokeObjectURL(file);

                const [newWidth, newHeight] = this.calculateSize(
                    img,
                    this.constraints.video.width.ideal,
                    this.constraints.video.height.ideal
                );

                this.putToCanvasHandler(img, newWidth, newHeight);
            };
        },
        calculateSize(img, maxWidth, maxHeight) {
            let width = img.width;
            let height = img.height;

            // calculate the width and height, constraining the proportions
            if (width > height) {
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = Math.round((width * maxHeight) / height);
                    height = maxHeight;
                }
            }
            return [width, height];
        },
        canvasGetContext() {
            const video = document.querySelector("video");
            this.putToCanvasHandler(video, video.videoWidth, video.videoHeight);
            this.playCaptureSound();
        },
        putToCanvasHandler(elCapture, width, height) {
            const canvas = document.querySelector(".photo");
            const ctx = canvas.getContext("2d");

            canvas.width = width;
            canvas.height = height;

            ctx.drawImage(elCapture, 0, 0, width, height);
            canvas.toBlob(this.putDataBlobToImg, "image/jpeg");
        },
        restartCameraHandler() {
            this.hasImage = null;
            const mode =
                this.constraints.video.facingMode == "environment"
                    ? "back"
                    : "front";

            setTimeout(() => {
                this.changeHandler(mode);
            }, 0);
        },
        async startCamera() {
            try {
                this.hasError = null;
                this.videoStream = await navigator.mediaDevices.getUserMedia(
                    this.constraints
                );

                this.checkIsHasTorch();

                const video = document.querySelector("video");

                if (!video) return;

                video.setAttribute("autoplay", "");
                video.setAttribute("muted", "");
                video.setAttribute("playsinline", "");

                if ("srcObject" in video) {
                    video.srcObject = this.videoStream;
                } else {
                    video.src = URL.createObjectURL(this.videoStream);
                }

                video.play();
            } catch (error) {
                this.hasError = error;
                throw new ErrorHandler(error);
            }
        },
    },
    mounted() {
        if ("mediaDevices" in navigator) this.changeHandler();
    },
    unmounted() {
        this.clearStream();
    },
};
</script>

<style lang=""></style>
