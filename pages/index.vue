<template>
    <MobileContainer :header="false">
        <HeaderMobile
            theme="default"
            title="Home"
            action-title="Sign Out"
            @action="connfirmLogout"
        />
        <ScrollContainer class="pt-2">
            <div class="flex flex-col">
                <template v-for="(item, i) in tracks" :key="i">
                    <ul class="py-4 border-b border-solid border-lightGray">
                        <li class="flex items-center gap-6">
                            <InputRadio
                                name="song"
                                :value="item.id"
                                v-model="selectedSong"
                                no-validity
                            />

                            <div class="flex gap-2 items-center" v-if="false">
                                <button class="text-primary">
                                    <IconPlay width="20px" height="20px" />
                                </button>
                                <button class="text-darkGray">
                                    <IconPause width="20px" height="20px" />
                                </button>
                            </div>

                            <div class="flex flex-1 gap-2 items-center">
                                <article class="w-20">
                                    <p class="mb-0.5 font-semibold text-sm">
                                        {{ item.name }}
                                    </p>
                                    <p
                                        class="text-xs text-elipsis text-darkGray"
                                    >
                                        {{ item.artist }}
                                    </p>
                                </article>

                                <div class="flex-1 flex flex-col">
                                    <audio
                                        class="w-full"
                                        :data-id="item.id"
                                        ref="audio"
                                        controls
                                    >
                                        <source
                                            :src="item.path"
                                            type="audio/mp3"
                                        />
                                        Your browser does not support the audio
                                        element.
                                    </audio>
                                </div>
                            </div>
                        </li>
                    </ul>
                </template>
            </div>

            <div class="mt-auto flex flex-col">
                <ButtonMain
                    text="Broadcast"
                    :disabled="!selectedSong"
                    @press="confirmBroadcast"
                />
            </div>
        </ScrollContainer>
    </MobileContainer>
</template>
<script setup>
const { InitialNotification } = useNotification();

definePageMeta({
    layout: "mobile",
    middleware: ["auth"],
    bottomNavigation: true,
});

const { $auth, $subscription } = useNuxtApp();
const router = useRouter();
const { removeUser } = useUserStore();

const audio = ref(null);
const selectedSong = ref(null);

const tracks = [
    {
        id: 1,
        name: "Song 1",
        artist: "Monica",
        path: "https://download.samplelib.com/mp3/sample-3s.mp3",
    },
    {
        id: 2,
        name: "Song 2",
        artist: "Carol",
        path: "https://download.samplelib.com/mp3/sample-6s.mp3",
    },
    {
        id: 3,
        name: "Song 3",
        artist: "Sam",
        path: "https://download.samplelib.com/mp3/sample-9s.mp3",
    },
];

function connfirmLogout() {
    Modal.confirm("Yakin ingin logout?");
    Modal.onconfirm = () => processLogout();
}

const processLogout = async () => {
    try {
        loadingStart();
        await $auth.logout();
        Modal.close();
    } catch (error) {
        throw new ErrorHandler(error);
    } finally {
        loadingStop();
        router.replace("/login");
        removeUser();
    }
};

const timeout = ref(null);
const isPlaying = (id) => {
    const audioElement = audio.value.find((el) => el.dataset.id == id);
    if (audioElement?.paused) {
        clearInterval(timeout.value);
    }
};

const playMusic = (id) => {
    const audioElement = audio.value.find((el) => el.dataset.id == id);
    if (audioElement) {
        stopAllMusic();
        clearInterval(timeout.value);
        audioElement.play();
        timeout.value = setInterval(() => {
            isPlaying(id);
        }, 1000);
    }
};

const stopMusic = (id) => {
    const audioElement = audio.value.find((el) => el.dataset.id == id);
    if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
    }
};

const stopAllMusic = () => {
    audio.value.forEach((el) => {
        el.pause();
        el.currentTime = 0;
    });
};

const getMessage = (event) => {
    const { payload } = event.data;
    const data = JSON.parse(payload);

    switch (data.type) {
        case "play":
            playMusic(data.id);
            break;
        case "stop":
            stopMusic(data.id);
            break;
        default:
            break;
    }
};

const confirmBroadcast = () => {
    Modal.confirm("Broadcast ke semua devices?");
    Modal.onconfirm = processBroadcast;
};

const processBroadcast = async () => {
    try {
        loadingStart();
        const { data } = await $subscription.broadcast({
            id: selectedSong.value,
            type: "play",
        });
    } catch (error) {
        throw new ErrorHandler(error);
    } finally {
        loadingStop();
    }
};

onMounted(async () => {
    InitialNotification();
    const channel = new BroadcastChannel("sw-messages");
    channel.addEventListener("message", getMessage);
});
</script>

<style lang="scss"></style>
