<template>
    <MobileContainer :header="false">
        <HeaderMobile theme="default" title="Live Streaming" />

        <ScrollContainer class="gap-4">
            <div class="flex flex-col gap-2">
                <div class="flex flex-col p-4">
                    <button class="btn btn-primary btn-md" @click="initStream">
                        Open Cam
                    </button>
                </div>

                <section class="grid grid-cols-2 gap-4">
                    <div>
                        <span class="text-sm text-primary"> My Video </span>
                        <video
                            id="my-video"
                            autoplay
                            class="object-cover bg-gray h-52"
                        />
                    </div>

                    <div>
                        <span class="text-sm text-primary">
                            Broadcast Video
                        </span>
                        <video
                            id="other-video"
                            autoplay
                            class="object-cover bg-gray h-52"
                        />
                    </div>
                </section>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <button
                    class="btn btn-sm btn-primary"
                    @click="createOfferStreaming"
                >
                    Start Streaming
                </button>
                <button
                    class="btn btn-sm btn-primary"
                    :disabled="!form.offer"
                    @click="clearForm"
                >
                    Reset Config
                </button>
            </div>

            <section v-if="false">
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

            <div class="flex justify-end mt-auto">
                <button
                    class="btn btn-sm btn-primary"
                    @click="$router.push('/streaming/list')"
                >
                    Stream List
                </button>
            </div>
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
    await createPeerConnection();

    if (localStream) {
        localStream.getTracks().forEach((track) => {
            track.stop();
        });
    }
};

const createPeerConnection = async () => {
    peerConnection = new RTCPeerConnection({
        iceServers: iceServers,
        // iceCandidatePoolSize: 2,
        // iceTransportPolicy: "relay",
    });

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

const offer_timeout = ref(null);
const createOfferStreaming = async () => {
    await initStream();
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
