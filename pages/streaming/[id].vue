<template>
    <MobileContainer :header="false">
        <ScrollContainer class="gap-0" style="padding: 0">
            <audio id="remoteAudio" hidden autoplay></audio>

            <div
                id="remoteAudioContainer"
                class="h-full bg-[#161616] flex items-center justify-center"
            >
                <div
                    v-if="!meetingInfo"
                    class="w-24 h-24 flex items-center justify-center rounded-full bg-gray-dark"
                ></div>

                <div
                    v-else
                    class="w-24 h-24 flex items-center justify-center rounded-full bg-primary"
                    :style="[
                        stringToColour(
                            canBroadcast ? myUser?.name : currentSpeaker?.name
                        ),
                    ]"
                >
                    <p class="text-5xl font-semibold uppercase text-white">
                        {{ getFirstCharName() }}
                    </p>
                </div>

                <section
                    v-if="isJoined"
                    class="absolute top-4 left-0 right-0 flex justify-between"
                >
                    <div class="flex-1 px-4 flex gap-2 items-center">
                        <i
                            class="inline-block w-4 h-4 rounded-full bg-danger"
                        ></i>
                        <p class="text-white text-xs">Llive</p>
                    </div>

                    <div
                        class="flex-1 px-6 rounded-full bg-transparent flex flex-col justify-center items-center h-10 w-52"
                    >
                        <p
                            class="text-xs flex gap-2 items-center text-white whitespace-nowrap"
                        >
                            <IconSound width="20px" height="20px" />
                            {{ currentSpeaker?.name || "Waiting" }}
                        </p>
                    </div>

                    <div class="flex-1 px-4 flex items-center justify-end">
                        <article class="flex flex-col items-center text-white">
                            <IconShowPassword />
                            <p class="text-[.6rem]">
                                {{ meetingInfo.onlineParticipants?.length }}
                                Views
                            </p>
                        </article>
                    </div>
                </section>

                <section
                    v-else
                    class="absolute top-4 left-0 right-0 flex justify-between"
                >
                    <div
                        class="flex-1 px-6 rounded-md bg-transparent flex flex-col justify-center items-center h-10 mx-4"
                    >
                        <p class="text-white text-xs">Ready to join</p>
                    </div>
                </section>
            </div>

            <div
                class="flex flex-col bg-[#37373775] rounded-t-2xl p-4 absolute bottom-0 left-0 right-0"
            >
                <div class="flex gap-4 justify-evenly items-center">
                    <button
                        v-if="canBroadcast"
                        @click="ChangeMICAudioState"
                        class="px-3 py-3 rounded-2xl text-white"
                        :class="[isMutedAudio ? 'bg-danger' : 'bg-[#c9c9c92e]']"
                    >
                        <IconNoRecord
                            v-if="isMutedAudio"
                            width="25px"
                            height="25px"
                        />
                        <IconRecord v-else width="25px" height="25px" />
                    </button>
                    <button
                        v-if="isJoined"
                        @click="LeaveAudioStream"
                        class="bg-danger px-3 py-3 rounded-2xl text-white"
                    >
                        <IconLogout width="25px" height="25px" />
                    </button>
                    <button
                        v-else
                        @click="JoinAudioStream"
                        class="bg-primary px-3 py-3 rounded-2xl text-white"
                    >
                        <IconLogin width="25px" height="25px" />
                    </button>
                </div>
            </div>
        </ScrollContainer>
    </MobileContainer>
</template>
<script setup>
definePageMeta({
    layout: "mobile",
    middleware: ["auth"],
});

useHead({
    meta: [
        { name: "theme-color", content: "#161616" },
        { name: "color-scheme", content: "dark" },

        { name: "mobile-web-app-capable", content: "Yes" },
        { name: "apple-mobile-web-app-capable", content: "Yes" },
        {
            name: "apple-mobile-web-app-status-bar-style",
            content: "black-translucent",
        },
    ],
});

const { $config } = useNuxtApp();

const router = useRouter();
const route = useRoute();

const { id } = route.params;

const user = useUserStore();

const meeting = ref(null);
const meetingInfo = ref(null);
const isJoined = ref(false);
const isMutedAudio = ref(false);

const currentSpeaker = ref(null);

const myUser = computed(() => {
    const { participantInfo } = meetingInfo.value || {};
    return participantInfo;
});

const canBroadcast = computed(() => {
    const roles = user.roles || [];
    const permissions = user.permissions || [];

    return (
        roles.some((val) => val == "ADMINISTRATOR") ||
        permissions.some((val) => val == "AUDIO_BROADCAST")
    );
});

const getFirstCharName = () => {
    let name = "";
    if (canBroadcast.value) name = myUser.value?.name;
    else name = currentSpeaker.value?.name;

    if (!name) return null;

    return String(name[0]).toUpperCase();
};

const handleParticipantJoined = (participantInfo) => {
    console.log("participant has joined the room", participantInfo);
};

const handleParticipantLeft = (participantInfo) => {
    console.log("participant has left the room", participantInfo);
};

const handleRemoteTrackStarted = (remoteTrackItem) => {
    const remoteTrack = remoteTrackItem.track;
    const remoteStream = new MediaStream([remoteTrack]);

    document.getElementById("remoteAudio").srcObject = remoteStream;
    document.getElementById("remoteAudio").play();
};

const handleActiveSpeaker = (speakerInfo) => {
    currentSpeaker.value = speakerInfo;
};

const LeaveAudioStream = async () => {
    try {
        await meeting.value.leaveMeeting();
        router.replace("/streaming");
    } catch (error) {
        throw new ErrorHandler(error);
    }
};

const ChangeMICAudioState = async () => {
    try {
        if (isMutedAudio.value) {
            isMutedAudio.value = false;

            if (meeting.value) {
                await meeting.value.unmuteLocalAudio();
            }
        } else {
            isMutedAudio.value = true;

            if (meeting.value) {
                await meeting.value.muteLocalAudio();
            }
        }
    } catch (error) {
        throw new ErrorHandler(error);
    }
};

async function JoinAudioStream() {
    try {
        meeting.value = new Metered.Meeting();
        meetingInfo.value = await meeting.value.join({
            roomURL: `${$config.public.METERED_NAME}/${id}`,
            name: user.user.name,
            isAdmin: true,
            admin: true,
        });

        meeting.value.on("participantJoined", handleParticipantJoined);
        meeting.value.on("remoteTrackStarted", handleRemoteTrackStarted);
        meeting.value.on("participantLeft", handleParticipantLeft);
        meeting.value.on("activeSpeaker", handleActiveSpeaker);

        if (canBroadcast.value) {
            await meeting.value.startAudio();
        } else {
            meeting.value.muteLocalAudio();
        }

        if (isMutedAudio.value) {
            meeting.value.muteLocalAudio();
        } else {
            meeting.value.unmuteLocalAudio();
        }

        isJoined.value = true;
        console.log("Meeting joined", meetingInfo.value);
    } catch (error) {
        throw new ErrorHandler(error);
    }
}
</script>

<style lang="scss"></style>
