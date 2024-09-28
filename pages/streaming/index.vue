<template>
    <MobileContainer :header="false">
        <HeaderMobile theme="default" title="Live Streaming" />

        <ScrollContainer class="gap-8">
            <div class="flex flex-col p-4">
                <button class="btn btn-primary btn-md" @click="initStream">
                    Open Cam
                </button>
            </div>

            <section class="grid grid-cols-2 gap-4">
                <div>
                    <span class="text-sm text-primary">My Video</span>
                    <video
                        id="my-video"
                        autoplay
                        class="object-cover bg-gray h-full"
                    />
                </div>

                <div>
                    <span class="text-sm text-primary">Broadcast Video</span>
                    <video
                        id="other-video"
                        autoplay
                        class="object-cover bg-gray h-full"
                    />
                </div>
            </section>

            <div class="grid grid-cols-2 gap-4">
                <button
                    class="btn btn-sm btn-primary"
                    @click="createOfferStreaming"
                >
                    Start Streaming
                </button>
                <button class="btn btn-sm btn-primary" @click="clearForm">
                    Reset Config
                </button>
            </div>

            <section>
                <div>
                    <InputText
                        type="textarea"
                        label="Offer"
                        v-model="form.offer"
                    />
                    <div class="flex justify-end">
                        <button
                            class="btn btn-sm btn-primary"
                            @click="createAnswerStreaming"
                        >
                            Answer
                        </button>
                    </div>
                </div>
                <div>
                    <InputText
                        type="textarea"
                        label="Answer"
                        v-model="form.answer"
                    />
                    <div class="flex justify-end">
                        <button
                            class="btn btn-sm btn-primary"
                            @click="addAnswerStreaming"
                        >
                            Add Answer
                        </button>
                    </div>
                </div>
            </section>
        </ScrollContainer>
    </MobileContainer>
</template>
<script setup>
definePageMeta({
    layout: "mobile",
    middleware: ["auth"],
    bottomNavigation: true,
});

const { $streaming } = useNuxtApp();

const user = useUserStore();

let peerConnection;
let localStream;
let remoteStream;

const form = reactive({
    offer: "",
    answer: "",
});

let servers = {
    iceServers: [
        {
            urls: [
                "stun:stun.l.google.com:19302",
                "stun:stun.l.google.com:5349",
                "stun:stun1.l.google.com:3478",
                "stun:stun1.l.google.com:5349",
                "stun:stun2.l.google.com:19302",
                "stun:stun2.l.google.com:5349",
                "stun:stun3.l.google.com:3478",
                "stun:stun3.l.google.com:5349",
                "stun:stun4.l.google.com:19302",
                "stun:stun4.l.google.com:5349",
            ],
        },
    ],
};

const initStream = async () => {
    localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
    });

    document.getElementById("my-video").srcObject = localStream;
};

const createPeerConnection = async () => {
    peerConnection = new RTCPeerConnection(servers);

    remoteStream = new MediaStream();
    const otherVideoElement = document.getElementById("other-video");
    otherVideoElement.srcObject = remoteStream;

    if (localStream) {
        localStream.getTracks().forEach((track) => {
            peerConnection.addTrack(track, localStream);
        });
    }

    peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
            remoteStream.addTrack(track);
        });
    };
};

const createOfferStreaming = async () => {
    await createPeerConnection();

    peerConnection.onicecandidate = async (event) => {
        //Event that fires off when a new offer ICE candidate is created
        if (event.candidate) {
            const payloadOffer = JSON.stringify(
                peerConnection.localDescription
            );

            if (!form.offer) {
                form.offer = payloadOffer;
                sendDataStreaming("offer", form.offer);
            }
        }
    };

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
};

const createAnswerStreaming = async () => {
    await createPeerConnection();

    let offer = JSON.parse(form.offer);

    peerConnection.onicecandidate = async (event) => {
        //Event that fires off when a new answer ICE candidate is created
        if (event.candidate) {
            const payloadAnswer = JSON.stringify(
                peerConnection.localDescription
            );

            if (!form.answer) {
                form.answer = payloadAnswer;
                sendDataStreaming("answer", form.answer);
            }
        }
    };

    await peerConnection.setRemoteDescription(offer);

    let answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
};

const addAnswerStreaming = async () => {
    let answer = JSON.parse(form.answer);
    if (!peerConnection.currentRemoteDescription) {
        console.log("addAnswerStreaming:", answer);
        peerConnection.setRemoteDescription(answer);
    }
};

const sendDataStreaming = async (type = "offer", payload) => {
    try {
        await $streaming.start({
            payload: { type, [type]: payload },
        });
    } catch (error) {
        throw new ErrorHandler(error);
    }
};

const handleMessageFromPeer = ({ payload }) => {
    switch (payload.type) {
        case "offer":
            if (!form.offer) {
                console.log("listen message offer");
                form.offer = payload.offer;
                createAnswerStreaming();
            }
            break;
        case "answer":
            if (!form.answer) {
                console.log("listen message answer");
                form.answer = payload.answer;
                addAnswerStreaming();
            }
            break;
        case "candidate":
            console.log("listen message candidate");
            if (peerConnection) {
                peerConnection.addIceCandidate(payload.candidate);
            }
            break;
        default:
            break;
    }
};

const clearForm = () => {
    form.offer = null;
    form.answer = null;
};

onMounted(() => {
    Echo.channel(`join-streaming`).listen(
        "JoinStreaming",
        handleMessageFromPeer
    );
});
</script>

<style lang="scss"></style>
