<template>
    <MobileContainer :header="false">
        <HeaderMobile
            theme="default"
            :title="getTitle"
            :subtitle="getSubtitle"
            action-type="option"
            action-title=" "
        />
        <template v-if="loadData">
            <div class="flex flex-col justify-center items-center flex-1">
                <MoonLoader :loading="loadData" color="#0071bc" />
            </div>
        </template>
        <ScrollContainer
            v-else
            class="pt-2 xs:px-0 pb-[66px]"
            @refresh="refreshHandler"
        >
            <ul class="flex flex-col gap-1 px-0 py-4" ref="chatContainer">
                <template v-for="(item, index) in [...messages]" :key="index">
                    <li
                        class="px-3 py-1 rounded-xl text-white flex items-end gap-2 max-w-[75%] text-xs"
                        :class="[
                            item.created_by == user.id
                                ? 'bg-[#18887b] self-end'
                                : ' bg-[#2d4d4a] self-start',
                            setMarginBottom(item, messages[index + 1])
                                ? 'mb-4'
                                : 'mb-0',
                        ]"
                    >
                        <template v-if="item.type == 'audio'">
                            <audio
                                class="flex-1"
                                v-if="item.path"
                                ref="playback"
                                :src="item.me ? item.path : getLink(item.path)"
                                controls
                                controlsList="nodownload"
                            >
                                Your browser does not support the audio element.
                            </audio>
                        </template>
                        <template v-else>
                            <p class="whitespace-pre-wrap">
                                {{ item.message }}
                            </p>
                        </template>
                        <p
                            class="text-[.5rem] leading-[.5rem] inline-block -mr-1"
                        >
                            {{ getHourMinute(item.created_at) }}
                        </p>
                    </li>
                    <li v-if="!messages.length" class="text-darkGray text-xs">
                        <p>No data messages.</p>
                    </li>
                </template>
            </ul>

            <div v-if="recording" class="recording">
                <p class="text-xs">Recording</p>
                <p class="text-xs" ref="time">00:00</p>
            </div>

            <div
                class="mobile-width-constraint px-4 py-2 border-t flex gap-4 items-center border-solid border-gray fixed bottom-0 left-0 right-0 bg-white"
            >
                <InputText
                    class="flex-1"
                    theme="primary"
                    type="chat"
                    no-validity
                    placeholder="Message"
                    v-model="message"
                />
                <button
                    class="text-primary"
                    @click="sendMessage"
                    v-if="message"
                >
                    <IconSend />
                </button>
                <div v-else>
                    <button
                        v-if="!recording"
                        class="text-danger"
                        @click="startRecording"
                    >
                        <IconRecord />
                    </button>
                    <button v-else class="text-danger" @click="stopRecording">
                        <IconStopRecording />
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

const { $user, $chat, $config } = useNuxtApp();

const user = useUserStore();

const router = useRouter();
const route = useRoute();

const { room_id } = route.params;

const getLink = computed(() => {
    return (path) => {
        const lastIndex = $config.public.API_URL.lastIndexOf("api");
        const apiUrl = $config.public.API_URL.slice(0, lastIndex);
        const newPath = path.replace("public", "storage");

        return apiUrl + newPath;
    };
});

const message = ref("");
const chatContainer = ref(null);

const getTitle = computed(() => {
    if (!data.value) return "";

    if (data.value.type == "GROUP") {
        return data.value.name;
    } else {
        return otherUser.value.name;
    }
});

const getSubtitle = computed(() => {
    if (!data.value) return "";

    if (data.value.type == "GROUP") {
        return members.value
            .map((v) => {
                return v.name;
            })
            .join(", ");
    }
});

const otherUser = computed(() => {
    const result = members.value.find((v) => v.id != user.id);
    return result;
});

const data = ref(null);
const messages = ref([]);
const members = ref([]);

const setMarginBottom = (currentChat, nextChat) => {
    let result = true;
    if (!nextChat) return false;

    result = currentChat.created_by != nextChat.created_by;
    return result;
};

const getChat = async () => {
    try {
        loadDataStart();
        const { data: result } = await $chat.getDetail(room_id);

        data.value = result;
        messages.value = result.messages;
        members.value = result.users;
    } catch (error) {
        throw new ErrorHandler(error);
    } finally {
        loadDataStop();

        await nextTick();
        focusToNewChat();
    }
};

const joinChat = async () => {
    try {
        const { data: result, message } = await $chat.join(room_id);
        console.log(message);
    } catch (error) {
        throw new ErrorHandler(error);
    }
};

const sendMessage = async () => {
    try {
        $chat.create(room_id, { message: message.value });

        const newMessage = {
            created_by: user.id,
            message: message.value,
            created_at: new Date(),
        };

        messages.value.push(newMessage);

        await nextTick();
        focusToNewChat();
    } catch (error) {
        throw new ErrorHandler(error);
    } finally {
        message.value = "";
    }
};

const focusToNewChat = () => {
    const container = chatContainer.value;
    if (!container) return;

    const newChat = container.querySelector("li:last-child");
    if (newChat && newChat.scrollIntoView) {
        setTimeout(() => {
            newChat.scrollIntoView({ behavior: "smooth" });
        }, 0);
    }
};

const addMessageToList = async ({ message }) => {
    if (!message) return;

    if (message.created_by != user.id) {
        messages.value.push(message);

        await nextTick();
        focusToNewChat();
    }
};

const refreshHandler = () => {
    getChat();
};

const recorder = ref(null);
const playback = ref(null);
const stream = ref(null);
const chunks = ref([]);
const recording = ref(false);

const time = ref(null);
const timeInterval = ref(null);
const count = ref(0);

const constraints = { audio: true };

async function startRecording() {
    try {
        if ("navigator" in window && navigator.mediaDevices) {
            const dataStream = await navigator.mediaDevices.getUserMedia(
                constraints
            );

            stream.value = dataStream;
            recorder.value = new MediaRecorder(stream.value);

            recorder.value.ondataavailable = (e) => {
                chunks.value.push(e.data);
            };

            recorder.value.onstop = (e) => {
                const blob = new Blob(chunks.value, {
                    type: "audio/mpeg",
                });

                sendAudio(blob);

                const tracks = stream.value.getTracks();

                tracks.forEach((track) => {
                    track.stop();
                });

                stream.value = null;
                chunks.value = [];

                recorder.value = null;
                recording.value = false;

                clearInterval(timeInterval.value);
                count.value = 0;
            };

            recorder.value.start();
            recording.value = true;

            timeInterval.value = setInterval(() => {
                const result = countingTime(++count.value);
                time.value.innerText = result;
            }, 1000);
        }
    } catch (error) {
        throw new ErrorHandler(error);
    }
}

const stopRecording = () => {
    if (!recorder.value) return;
    recorder.value.stop();
};

const sendAudio = async (blob) => {
    try {
        const formData = new FormData();
        formData.append("audio", blob);

        $chat.create(room_id, formData);

        const audioUrl = URL.createObjectURL(blob);
        const newMessage = {
            created_by: user.id,
            path: audioUrl,
            type: "audio",
            me: true,
            created_at: new Date(),
        };

        messages.value.push(newMessage);

        await nextTick();
        focusToNewChat();
    } catch (error) {
        throw new ErrorHandler(error);
    } finally {
        message.value = "";
    }
};

onMounted(() => {
    joinChat();
    getChat();

    Echo.channel(`join-chat.${room_id}`).listen("JoinChat", (e) => {});

    Echo.channel(`send-message.${room_id}`).listen(
        "SendMessage",
        addMessageToList
    );
});

onBeforeUnmount(() => {
    Echo.channel(`join-chat.${room_id}`).stopListening("JoinChat");
});
</script>

<style lang="scss">
.recording {
    @apply fixed top-20 px-4 py-2 flex self-end gap-2 items-center text-white rounded-md bg-red;
}

.recording:before,
.recording:after {
    content: "";
    position: absolute;
    background: rgba(255, 98, 98, 0.763);
    width: 75%;
    height: 30px;
    border-radius: 2px;
    z-index: -1;
    animation: wave 1s infinite linear;
}

.recording:after {
    width: 75%;
    height: 25px;
    animation: wave 3s infinite linear;
}

@keyframes wave {
    0% {
        transform: scale(1);
        opacity: 1;
    }
    100% {
        transform: scale(2);
        opacity: 0;
    }
}
</style>
