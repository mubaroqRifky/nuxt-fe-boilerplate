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

            <article v-if="qrvalue">
                <span class="text-xs font-semibold">Qrcode Result</span>
                <p class="text-sm text-primary break-words">
                    {{ qrvalue }}
                </p>
            </article>

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

                <qrcode-stream
                    style="position: absolute"
                    :constraints="selectedConstraints"
                    :track="trackFunctionSelected.value"
                    :formats="selectedBarcodeFormats"
                    @error="onError"
                    @detect="onDetect"
                    @camera-on="onCameraReady"
                />

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
                        @click="switchCamera"
                        class="cursor-pointer flex justify-center items-center w-12 h-12 p-2 rounded-full bg-transparent border border-white border-solid transform transition-all rotate-0"
                    >
                        <IconChangeCamera />
                    </button>

                    <button
                        @click="captureValue"
                        class="cursor-pointer w-16 h-16 flex justify-center items-center bg-white rounded-full outline-offset-4 outline outline-white hover:bg-whiteTransparent hover:outline-whiteTransparent transition-all"
                    ></button>

                    <button
                        @click="turnFlashHandler"
                        :disabled="torchNotSupported"
                        class="cursor-pointer flex justify-center items-center w-12 h-12 p-2 rounded-full border border-white border-solid"
                        :class="
                            torchNotSupported
                                ? 'bg-softGray text-darkGray'
                                : 'bg-transparent'
                        "
                    >
                        <IconFlash :flash="torchActive" />
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
const tempQrValue = ref(null);

const torchActive = ref(false);
const torchNotSupported = ref(false);

const videoStream = ref(null);

const turnFlashHandler = () => {
    try {
        torchActive.value = !torchActive.value;

        const track = videoStream.value.getVideoTracks()[0];
        track.applyConstraints({
            advanced: [{ torch: torchActive.value }],
        });

        // const track = this.videoStream.getVideoTracks()[0];
        // track.applyConstraints({
        //     advanced: [{ torch: this.isTorch }],
        // });
    } catch (error) {
        throw new ErrorHandler(error);
    }
};

const openScanQRHandler = () => {
    qrcode.value = true;
};

const closeQRHandler = () => {
    qrcode.value = false;
};

function onDetect(detectedCodes) {
    tempQrValue.value = JSON.stringify(
        detectedCodes.map((code) => code.rawValue)
    );
}

function onDecode({ rawValue }) {
    return rawValue;
}

function drawTextBG(ctx, txt, font, x, y) {
    /// lets save current state as we make a lot of changes
    ctx.save();

    /// set font
    ctx.font = font;

    /// draw text from top - makes life easier at the moment
    ctx.textBaseline = "top";

    /// color for background
    ctx.fillStyle = "#fff";

    /// get width of text
    var width = ctx.measureText(txt).width;

    /// draw background rect assuming height of font
    ctx.fillRect(x, y - 2, width, parseInt(font, 16));

    /// text color
    ctx.fillStyle = "#6a7ff5";

    /// draw text on top
    ctx.fillText(txt, x, y);

    /// restore original state
    ctx.restore();
}

const selectedConstraints = ref({ facingMode: "environment" });
const defaultConstraintOptions = [
    { label: "rear camera", constraints: { facingMode: "environment" } },
    { label: "front camera", constraints: { facingMode: "user" } },
];
const constraintOptions = ref(defaultConstraintOptions);

function paintOutline(detectedCodes, ctx) {
    for (const detectedCode of detectedCodes) {
        const [firstPoint, ...otherPoints] = detectedCode.cornerPoints;

        ctx.strokeStyle = "red";

        ctx.beginPath();
        ctx.moveTo(firstPoint.x, firstPoint.y);
        for (const { x, y } of otherPoints) {
            ctx.lineTo(x, y);
        }
        ctx.lineTo(firstPoint.x, firstPoint.y);
        ctx.closePath();
        ctx.stroke();
    }
}
function paintBoundingBox(detectedCodes, ctx) {
    const boxAdjustment = document.querySelector(".qrcode-position");

    const pointX = boxAdjustment.offsetLeft;
    const pointY = boxAdjustment.offsetTop;
    const pointWidth = boxAdjustment.clientWidth;
    const pointHeight = boxAdjustment.clientHeight;

    for (const detectedCode of detectedCodes) {
        const {
            boundingBox: { x, y, width, height },
        } = detectedCode;

        if (
            x > pointX &&
            x + width < pointX + pointWidth &&
            y > pointY &&
            y + height < pointY + pointHeight
        ) {
            // const value = onDecode(detectedCode);
            // onDetect(value);

            ctx.lineWidth = 2;
            ctx.strokeStyle = "#3bff00";
            ctx.strokeRect(x, y, width, height);

            drawTextBG(ctx, tempQrValue.value, "16px serif", x, y + height / 2);
        }
    }
}
function paintCenterText(detectedCodes, ctx) {
    for (const detectedCode of detectedCodes) {
        const { boundingBox, rawValue } = detectedCode;

        const centerX = boundingBox.x + boundingBox.width / 2;
        const centerY = boundingBox.y + boundingBox.height / 2;

        const fontSize = Math.max(
            12,
            (50 * boundingBox.width) / ctx.canvas.width
        );

        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.textAlign = "center";

        ctx.lineWidth = 3;
        ctx.strokeStyle = "#35495e";
        ctx.strokeText(detectedCode.rawValue, centerX, centerY);

        ctx.fillStyle = "#5cb984";
        ctx.fillText(rawValue, centerX, centerY);
    }
}

const trackFunctionOptions = [
    { text: "nothing (default)", value: undefined },
    { text: "outline", value: paintOutline },
    { text: "centered text", value: paintCenterText },
    { text: "bounding box", value: paintBoundingBox },
];
const trackFunctionSelected = ref(trackFunctionOptions[3]);

async function onCameraReady(capabilities) {
    torchNotSupported.value = !capabilities.torch;

    // NOTE: on iOS we can't invoke `enumerateDevices` before the user has given
    // camera access permission. `QrcodeStream` internally takes care of
    // requesting the permissions. The `camera-on` event should guarantee that this
    // has happened.

    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(({ kind }) => kind === "videoinput");

    navigator.mediaDevices.getUserMedia({ video: true }).then((mediaStream) => {
        videoStream.value = mediaStream;
    });

    constraintOptions.value = [
        ...defaultConstraintOptions,
        ...videoDevices.map(({ deviceId, label }) => ({
            label: `${label} (ID: ${deviceId})`,
            constraints: { deviceId },
        })),
    ];
}

const switchCamera = () => {
    switch (selectedConstraints.value.facingMode) {
        case "environment":
            selectedConstraints.value.facingMode = "user";
            break;
        case "user":
            selectedConstraints.value.facingMode = "environment";
            break;
    }
};

const captureValue = () => {
    qrvalue.value = tempQrValue.value;
    closeQRHandler();
};

const barcodeFormats = ref({
    aztec: true,
    code_128: true,
    code_39: true,
    code_93: true,
    codabar: true,
    databar: true,
    databar_expanded: true,
    data_matrix: true,
    dx_film_edge: true,
    ean_13: true,
    ean_8: true,
    itf: true,
    maxi_code: true,
    micro_qr_code: true,
    pdf417: true,
    qr_code: true,
    rm_qr_code: true,
    upc_a: true,
    upc_e: true,
    linear_codes: true,
    matrix_codes: true,
});

const selectedBarcodeFormats = computed(() => {
    return Object.keys(barcodeFormats.value).filter(
        (format) => barcodeFormats.value[format]
    );
});

function onError(err) {
    try {
        if (err.name === "NotAllowedError") {
            throw new Error("you need to grant camera access permission");
        } else if (err.name === "NotFoundError") {
            throw new Error("no camera on this device");
        } else if (err.name === "NotSupportedError") {
            throw new Error("secure context required (HTTPS, localhost)");
        } else if (err.name === "NotReadableError") {
            throw new Error("is the camera already in use?");
        } else if (err.name === "OverconstrainedError") {
            throw new Error("installed cameras are not suitable");
        } else if (err.name === "StreamApiNotSupportedError") {
            throw new Error("Stream API is not supported in this browser");
        } else if (err.name === "InsecureContextError") {
            throw new Error(
                "Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP."
            );
        } else {
            throw new Error(err.message);
        }
    } catch (error) {
        throw new ErrorHandler(error);
    }
}
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
    position: relative;
    width: 300px;
    height: 300px;
    margin: auto;
    /* margin-top: -2rem; */
    /* left: 50%;
    top: 50%;
    transform: translate(-50%, -50%); */

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
        animation: scanline 5s infinite;
    }
}

@keyframes scanline {
    0% {
        top: -50%;
    }
    50% {
        top: 100%;
    }
    100% {
        top: -50%;
    }
}
</style>
