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
                <li
                    v-for="(item, index) in [...messages]"
                    :key="index"
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
                    <p>
                        {{ item.message }}
                    </p>
                    <p class="text-[.5rem] leading-[.5rem] inline-block -mr-1">
                        {{ getHourMinute(item.created_at) }}
                    </p>
                </li>
                <li v-if="!messages.length" class="text-darkGray text-xs">
                    <p>No data messages.</p>
                </li>
            </ul>

            <div
                class="mobile-width-constraint px-4 py-2 border-t flex gap-4 items-center border-solid border-gray fixed bottom-0 left-0 right-0 bg-white"
            >
                <InputText
                    class="flex-1"
                    theme="primary"
                    no-validity
                    placeholder="Message"
                    v-model="message"
                    @keyup.enter="sendMessage"
                />
                <button class="text-primary" @click="sendMessage">
                    <IconSend />
                </button>
            </div>
        </ScrollContainer>
    </MobileContainer>
</template>

<script setup>
definePageMeta({
    layout: "mobile",
    middleware: ["auth"],
});

const { $user, $chat } = useNuxtApp();

const user = useUserStore();

const router = useRouter();
const route = useRoute();

const { room_id } = route.params;

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

<style lang="scss"></style>
