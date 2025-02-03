<template>
    <MobileContainer title="QR Scan">
        <ScrollContainer v-if="!qrcode">
            <div
                class="flex-1 min-h-52 max-h-52 bg-softGray flex justify-center items-center"
            >
                <img
                    v-if="qrvalue"
                    :src="qrvalue"
                    class="w-full h-full object-contain"
                />
                <div
                    v-else
                    class="w-full rounded-md text-lightGray flex justify-center items-center"
                >
                    <IconImage width="100px" height="100px" />
                </div>
            </div>

            <ButtonPrimary text="Open Scan QR" @press="openScanQRHandler" />
        </ScrollContainer>

        <section class="qrcode-container" v-else>
            <div class="flex flex-col flex-1 h-full bg-black relative">
                <div id="scanline" class="run"></div>

                <section
                    class="flex justify-between items-center absolute w-full z-10 px-2"
                >
                    <div
                        class="flex gap-2 items-center text-white"
                        v-if="!loading"
                    >
                        <button @click="closeQRHandler" class="px-4 py-4">
                            <IconClose />
                        </button>

                        <h3 class="text-lg">Scan QR Code</h3>
                    </div>

                    <label for="fileUploadImage" class="text-white p-2 flex">
                        <input
                            type="file"
                            class="hidden"
                            id="fileUploadImage"
                            accept="image/*"
                        />

                        <button>
                            <IconImage
                                :bold="true"
                                width="30px"
                                height="30px"
                            />
                        </button>
                    </label>
                </section>

                <qrcode-stream></qrcode-stream>

                <div class="qrcode-position">
                    <template v-for="(item, index) in 4" :key="index">
                        <span></span>
                    </template>

                    <p
                        class="text-xs w-full absolute -bottom-12 text-center text-white"
                    >
                        Posisikan kotak pada QR code
                    </p>
                </div>

                <div
                    class="grid justify-center absolute bottom-0 p-6 left-0 right-0 justify-items-center items-center text-white z-40 grid-cols-3"
                >
                    <button
                        class="cursor-pointer flex justify-center items-center w-12 h-12 p-2 rounded-full bg-transparent border border-white border-solid transform transition-all rotate-0"
                    >
                        <IconChangeCamera />
                    </button>

                    <button
                        class="cursor-pointer w-16 h-16 flex justify-center items-center bg-white rounded-full outline-offset-4 outline outline-white hover:bg-whiteTransparent hover:outline-whiteTransparent transition-all"
                    ></button>

                    <button
                        class="cursor-pointer flex justify-center items-center w-12 h-12 p-2 rounded-full border border-white border-solid bg-transparent"
                    >
                        <IconFlash :flash="true" />
                    </button>
                </div>
            </div>
        </section>
    </MobileContainer>
</template>

<script setup>
definePageMeta({
    layout: "mobile",
    middleware: [],
});

const qrcode = ref(false);
const qrvalue = ref(null);

const openScanQRHandler = () => {
    qrcode.value = true;
};

const closeQRHandler = () => {
    qrcode.value = false;
};
</script>

<style lang="scss" scoped>
.qrcode-container {
    width: 100%;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 500;

    .qrcode-block {
        position: relative;
        display: flex;
        justify-content: center;
        height: 100vh;

        .qrcode-stream-wrapper {
            > video {
                transform: rotateY(var(--rotate));
            }
        }

        .qrcode-bottom-options {
            position: absolute;
            bottom: 0;
            left: -1px;
            right: -1px;
            background-color: whitesmoke;
            padding: 2em 1em 1em;
            border-top-left-radius: 50%;
            border-top-right-radius: 50%;
            box-shadow: 0px -1px 5px -3px gray;
            .qrcode-bottom-container {
                display: flex;
                justify-content: space-around;

                button {
                    background-color: white;
                    border: none;
                    border-radius: 50%;
                    border: 1px solid rgb(223, 223, 223);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 50px;
                    height: 50px;
                    box-shadow: 0px 0px 5px -3px rgb(75, 75, 75);

                    &:hover {
                        box-shadow: 0px 0px 5px -4px rgb(75, 75, 75);
                    }
                }
            }
        }
    }
}

.qrcode-position {
    position: absolute;
    width: 300px;
    height: 300px;
    margin-top: -2rem;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    span {
        position: absolute;
        width: 50px;
        height: 50px;
        border-color: white;
        border-style: solid;
        border-width: 0px;

        &:first-child {
            top: 0;
            left: 0;
            border-top-width: 2px;
            border-left-width: 2px;
            border-top-left-radius: 20%;
        }
        &:nth-child(2) {
            top: 0;
            right: 0;
            border-top-width: 2px;
            border-right-width: 2px;
            border-top-right-radius: 20%;
        }
        &:nth-child(3) {
            bottom: 0;
            right: 0;
            border-bottom-width: 2px;
            border-right-width: 2px;
            border-bottom-right-radius: 20%;
        }
        &:nth-child(4) {
            bottom: 0;
            left: 0;
            border-bottom-width: 2px;
            border-left-width: 2px;
            border-bottom-left-radius: 20%;
        }
    }
}

#scanline {
    color: #fff;
    position: absolute;
    top: -250px;
    width: 100%;
    height: 200px;
    pointer-events: none;
    z-index: 10;
    background: linear-gradient(
        to bottom,
        rgba(100, 200, 255, 0) 15%,
        rgba(100, 200, 255, 0.015) 35%,
        rgba(100, 200, 255, 0.1) 95%,
        rgba(100, 200, 255, 0.25) 96%,
        rgba(100, 200, 255, 0.15) 98%,
        rgba(100, 200, 255, 0.05)
    );

    &.run {
        animation: scanline 1s infinite;
    }
}

@keyframes scanline {
    0% {
        top: -100%;
    }
    50% {
        top: 100%;
    }
    100% {
        top: -100%;
    }
}
</style>
