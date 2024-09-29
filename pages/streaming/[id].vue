<template>
    <MobileContainer :header="false">
        <ScrollContainer class="gap-2" style="padding: 0">
            <div class="flex flex-col flex-1 gap-2">
                <video
                    id="my-video"
                    autoplay
                    class="object-cover bg-gray h-full"
                    :class="user.id == id ? '' : 'hidden'"
                />

                <video
                    id="other-video"
                    autoplay
                    class="object-cover bg-gray h-full"
                    :class="user.id == id ? 'hidden' : ''"
                />
            </div>
        </ScrollContainer>

        <div
            class="flex flex-col p-4 absolute bottom-0 left-0 right-0"
            v-if="user.id == id"
        >
            <button
                v-if="!isStreaming"
                class="btn btn-md btn-primary"
                @click="createOfferStreaming"
            >
                Start Streaming
            </button>
            <div v-else class="w-full flex flex-col gap-2">
                <button class="btn btn-md btn-primary" @click="stopStream">
                    Stop Streaming
                </button>
                <button
                    class="btn btn-md btn-primary"
                    @click="createOfferStreaming"
                >
                    Re-Offer
                </button>
            </div>
        </div>
    </MobileContainer>
</template>
<script setup>
definePageMeta({
    layout: "mobile",
    middleware: ["auth"],
});

const { $streaming } = useNuxtApp();

const route = useRoute();

const { id } = route.params;

const user = useUserStore();

const isStreaming = ref(false);

let peerConnection;
let localStream;
let remoteStream;

const form = reactive({
    offer: "",
    answer: "",
});

let iceServers = [
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
    {
        urls: "turn:141.11.25.164:3478",
        username: "itdev",
        credential: "asia",
    },
];

const initStream = async () => {
    localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
    });

    document.getElementById("my-video").srcObject = localStream;
};

const stopStream = async () => {
    isStreaming.value = false;

    await createPeerConnection();

    if (localStream) {
        localStream.getTracks().forEach((track) => {
            track.stop();
        });
    }

    sendDataStreaming("stop", null);
};

const createPeerConnection = async () => {
    peerConnection = new RTCPeerConnection({
        iceServers: iceServers,
        // iceCandidatePoolSize: 2,
        // iceTransportPolicy: "relay",
    });

    remoteStream = new MediaStream();
    const otherVideoElement = document.getElementById("other-video");
    if (otherVideoElement) {
        otherVideoElement.srcObject = remoteStream;
    }

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
    clearForm();
    await initStream();
    isStreaming.value = true;
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
    if (!peerConnection.currentRemoteDescription || true) {
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
            clearForm();
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

onBeforeUnmount(() => {
    stopStream();
});
</script>

<style lang="scss"></style>
