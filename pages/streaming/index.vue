<template>
    <MobileContainer :header="false">
        <HeaderMobile theme="default" title="Live Streaming" />

        <template v-if="loadData">
            <div class="flex flex-col justify-center items-center flex-1">
                <MoonLoader color="#0071bc" />
            </div>
        </template>

        <ScrollContainer v-else class="gap-4">
            <ul class="divide-y divide-solid divide-gray">
                <template v-for="(item, index) in list_rooms" :key="index">
                    <li
                        class="py-2 flex gap-4 justify-between items-center"
                        @click="$router.push(`/streaming/${item.roomName}`)"
                    >
                        <article>
                            <p class="text-xs text-darkGray">Live Stream</p>
                            <p class="text-sm font-semibold text-primary">
                                {{ item.roomName }}
                            </p>
                        </article>

                        <p
                            v-if="user.id == item.id"
                            class="px-2 py-1 rounded-xl text-xs bg-primary text-white"
                        >
                            My Room
                        </p>
                    </li>
                </template>
            </ul>

            <template v-if="!list_rooms.length">
                <div>
                    <p class="text-gray text-sm">No data stream</p>
                </div>
            </template>

            <button
                v-if="role(ADMINISTRATOR)"
                class="shadow-md absolute right-4 rounded-md p-2 transition-all hover:bg-primary hover:text-white"
                style="bottom: 5rem"
                @click="show_form = true"
            >
                <IconAddChat width="25px" height="25px" />
            </button>
        </ScrollContainer>

        <ModalForm
            title="Create Room"
            v-if="show_form"
            @close="closeModalForm"
            @proses="processCreateRoom"
        >
            <InputText
                label="Room Name"
                placeholder="Room Name"
                v-model="form_room.roomName"
            />
        </ModalForm>
    </MobileContainer>
</template>
<script setup>
definePageMeta({
    layout: "mobile",
    middleware: ["auth"],
    bottomNavigation: true,
});

const { $user, $metered } = useNuxtApp();
const router = useRouter();

const user = useUserStore();

const list_users = ref([]);
const userHasNextPage = ref(false);
const params_user = reactive({ page: 1, per_page: 25, search: "" });
const getUsers = async () => {
    try {
        const { data, meta } = await $user.getAll(params_user);
        list_users.value = data;
        userHasNextPage.value = meta?.to < meta?.total;
    } catch (error) {
        throw new ErrorHandler(error);
    }
};

const list_rooms = ref([]);
const getAllRooms = async () => {
    try {
        loadDataStart();
        const data = await $metered.getAllRoom();
        list_rooms.value = data;
    } catch (error) {
        throw new ErrorHandler(error);
    } finally {
        loadDataStop();
    }
};

const form_room = reactive({
    roomName: "",
    privacy: "public",
    ejectAtRoomExp: true,
    notBeforeUnixSec: 0,
    maxParticipants: 0,
    autoJoin: true,
    enableRequestToJoin: false,
    enableCamera: false,
    enableMicrophone: true,
    enableChat: false,
    enableScreenSharing: false,
    newChatForMeetingSession: true,
    showInviteBox: false,
    joinVideoOn: false,
    joinAudioOn: true,
    ownerOnlyBroadcast: false,
    enableRecording: false,
    recordRoom: false,
    ejectAfterElapsedTimeInSec: 0,
    meetingJoinWebhook: "string",
    enableWatermark: false,
    endMeetingAfterNoActivityInSec: 0,
    audioOnlyRoom: true,
});

const show_form = ref(false);
const closeModalForm = () => {
    show_form.value = false;
    form_room.roomName = "";
};

const processCreateRoom = async () => {
    try {
        loadingStart();
        const payload = {
            roomName: form_room.roomName.toLowerCase().replaceAll(" ", "_"),
        };
        await $metered.createRoom(payload);
        Modal.success("Success create room");
        closeModalForm();
        Modal.onclose = () => {
            getAllRooms();
        };
    } catch (error) {
        throw new ErrorHandler(error);
    } finally {
        loadingStop();
    }
};

onMounted(() => {
    getUsers();
    getAllRooms();
});

onBeforeUnmount(() => {});
</script>

<style lang="scss"></style>
