<template>
    <MobileContainer :header="false">
        <HeaderMobile theme="default" title="List Chat" />
        <template v-if="loadData">
            <div class="flex flex-col justify-center items-center flex-1">
                <MoonLoader color="#0071bc" />
            </div>
        </template>
        <ScrollContainer v-else class="pt-2 xs:px-0" @refresh="refreshHandler">
            <ul class="divide-y divide-solid divide-gray">
                <li
                    v-for="(item, index) in list_chat"
                    :key="index"
                    class="px-0 py-2 cursor-pointer"
                    @click="$router.push(`/chat/` + item.id)"
                >
                    <article>
                        <h2 class="font-semibold text-gray-dark text-sm">
                            {{ getName(item) }}
                        </h2>
                        <template v-if="item.messages.length">
                            <p
                                class="text-darkGray text-xs text-elipsis elipsis-1"
                            >
                                {{ getRecentMessage(item.messages) }}
                            </p>
                        </template>
                        <template v-else>
                            <p class="text-darkGray text-xs">
                                There is no message
                            </p>
                        </template>
                    </article>
                </li>
            </ul>
            <button
                class="shadow-md absolute right-4 rounded-md p-2 transition-all hover:bg-primary hover:text-white"
                style="bottom: 5rem"
                @click="openModalList"
            >
                <IconAddChat width="25px" height="25px" />
            </button>
        </ScrollContainer>

        <ModalBottomScreen
            title="Add new chat"
            class-container="px-4 py-6 min-h-[50dvh]"
            v-if="show_modal_list"
            @close="closeModalList"
        >
            <div
                class="absolute left-0 right-0 top-[48.7px] bg-white px-4 py-4"
            >
                <InputText
                    size="small"
                    placeholder="Cari"
                    type="search"
                    no-validity
                    @search="searchUserHandler"
                />
            </div>
            <template v-if="loadUser">
                <div
                    class="flex flex-col justify-center items-center h-full flex-1 mt-[25px] mb-32"
                >
                    <MoonLoader color="#0071bc" />
                </div>
            </template>
            <ul v-else class="divide-y divide-solid divide-gray mt-[45px]">
                <li
                    v-for="(item, index) in list_users"
                    :key="index"
                    class="px-4 py-2"
                    :class="isUserSelected(item) ? 'bg-primaryLight' : ''"
                    @click="selectUserHandler(item)"
                >
                    <article>
                        <h4 class="text-sm font-semibold">
                            {{ item.name }}
                        </h4>
                        <p class="text-xs text-darkGray">
                            {{ item.email }}
                        </p>
                    </article>
                </li>
                <template v-if="loadMoreUser">
                    <div class="flex justify-center items-center">
                        <div class="px-6 py-2">
                            <BeatLoader color="#a9dcff" />
                        </div>
                    </div>
                </template>
            </ul>

            <template #action>
                <div class="flex flex-col px-4 py-4">
                    <button
                        class="btn btn-md btn-primary"
                        @click="confirmCreateChat"
                        :disabled="!selectedUser.length"
                    >
                        Chat
                    </button>
                </div>
            </template>
        </ModalBottomScreen>

        <ModalForm
            title="Create Group Name"
            v-if="show_form"
            @proses="createChatHandler"
            @close="closeModalForm"
        >
            <InputText placeholder="Group Name" v-model="form.name" />
        </ModalForm>
    </MobileContainer>
</template>
<script setup>
definePageMeta({
    layout: "mobile",
    middleware: ["auth"],
    bottomNavigation: true,
});

const { $user, $chat } = useNuxtApp();
const router = useRouter();

const user = useUserStore();

const list_chat = ref([]);
const getRooms = async () => {
    try {
        loadDataStart();
        const { data } = await $user.getRoomChat();
        list_chat.value = data;
    } catch (error) {
        throw new ErrorHandler(error);
    } finally {
        loadDataStop();
    }
};

const getName = (item) => {
    if (item.type == "GROUP") {
        return item.name;
    } else {
        const result = item.users.find((v) => v.id != user.id);
        return result?.name;
    }
};

const getRecentMessage = (messages = []) => {
    const lastItem = messages[messages.length - 1];

    if (!lastItem) return "No messages yet";

    if (lastItem.type == "audio") {
        return "Audio";
    } else {
        return lastItem.message;
    }
};

const refreshHandler = () => {
    getRooms();
};

const show_modal_list = ref(false);
const openModalList = () => {
    show_modal_list.value = true;

    if (!list_users.length) getUsers();
};
const closeModalList = () => {
    show_modal_list.value = false;
    resetForm();
};

const list_users = ref([]);
const loadUser = ref(false);
const loadMoreUser = ref(false);
const userHasNextPage = ref(false);
const params_user = reactive({ page: 1, per_page: 25, search: "" });
const getUsers = async () => {
    try {
        loadUser.value = true;
        const { data, meta } = await $user.getAll(params_user);
        list_users.value = data.filter((v) => v.id != user.id);
        userHasNextPage.value = meta?.to < meta?.total;
    } catch (error) {
        throw new ErrorHandler(error);
    } finally {
        loadUser.value = false;
    }
};

const searchUserHandler = (e) => {
    const { target } = e;
    list_users.value = [];
    params_user.page = 1;
    params_user.per_page = 25;
    params_user.search = target.value;

    getUsers();
};

const selectedUser = ref([]);
const selectUserHandler = (item) => {
    const exists = selectedUser.value.find((v) => v.id == item.id);
    if (exists) {
        selectedUser.value = selectedUser.value.filter((v) => v.id != item.id);
    } else {
        selectedUser.value.push(item);
    }
};

const isUserSelected = (item) => {
    const exists = selectedUser.value.find((v) => v.id == item.id);
    return !!exists;
};

const form = reactive({
    name: "",
    type: "",
    members: [],
});

const show_form = ref(false);
const closeModalForm = () => {
    show_form.value = false;
};

const resetForm = () => {
    selectedUser.value = [];
    form.name = "";
    form.type = "";
    form.members = [];
};

const getPayload = () => {
    if (!selectedUser.value.length) return {};

    if (selectedUser.value.length > 1) {
        form.type = "GROUP";
    } else {
        form.type = "PRIVATE";
        form.name = selectedUser.value[0].name;
    }

    form.members = selectedUser.value.map((v) => v.id);
    form.members.push(user.id);

    return form;
};

const checkUserIsExsitsInChat = (selected_user) => {
    let result = false;
    const privateChat = list_chat.value.filter((v) => v.type == "PRIVATE");
    privateChat.forEach((val) => {
        const exists = val.users.find((v) => v.id == selected_user.id);
        if (exists) result = val;
    });
    return result;
};

const confirmCreateChat = () => {
    if (!selectedUser.value.length) return;

    if (selectedUser.value.length > 1) {
        show_form.value = true;
    } else {
        const [selected_user] = selectedUser.value;
        const userExist = checkUserIsExsitsInChat(selected_user);

        if (userExist) {
            redirectToRoomChat(userExist.id);
        } else {
            createChatHandler();
        }
    }
};

const redirectToRoomChat = (id) => {
    router.push("/chat/" + id);
    closeModalList();
    closeModalForm();
};

const createChatHandler = async () => {
    try {
        loadingStart();
        const payload = getPayload();
        const { data } = await $chat.createRoom(payload);

        redirectToRoomChat(data.id);
    } catch (error) {
        throw new ErrorHandler(error);
    } finally {
        loadingStop();
    }
};

onMounted(() => {
    getRooms();
});
</script>

<style lang="scss"></style>
