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

const offer_timeout = ref(null);
const createOfferStreaming = async () => {
    clearForm();
    await initStream();
    isStreaming.value = true;
    await createPeerConnection();

    peerConnection.onicecandidate = async (event) => {
        const payloadOffer = JSON.stringify(peerConnection.localDescription);

        clearTimeout(offer_timeout.value);
        offer_timeout.value = setTimeout(() => {
            form.offer = payloadOffer;
            sendDataStreaming("offer", form.offer);
        }, 0);
    };

    window.channel = peerConnection.createDataChannel("channel");
    window.channel.onmessage = (e) =>
        console.log("You got a new message : ", e.data);
    window.channel.onopen = () => console.log("Connection created!!");

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
};

const answer_timeout = ref(null);
const createAnswerStreaming = async () => {
    await createPeerConnection();

    peerConnection.onicecandidate = async (event) => {
        const payloadAnswer = JSON.stringify(peerConnection.localDescription);

        clearTimeout(answer_timeout.value);
        answer_timeout.value = setTimeout(() => {
            form.answer = payloadAnswer;
            sendDataStreaming("answer", form.answer);
        }, 0);
    };

    peerConnection.ondatachannel = (e) => {
        peerConnection.dc = e.channel;
        peerConnection.dc.onmessage = (e) => {
            console.log("New message from client! " + e.data);
        };
        peerConnection.dc.onopen = (e) => {
            const otherVideoElement = document.getElementById("other-video");
            if (otherVideoElement) otherVideoElement.play();
            console.log("Connection opened!");
        };
    };

    let offer = JSON.parse(form.offer);
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
