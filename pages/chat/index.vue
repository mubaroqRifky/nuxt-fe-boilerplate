<template>
    <MobileContainer :header="false">
        <HeaderMobile theme="default" title="List Chat" />
        <template v-if="loadData">
            <div class="flex flex-col justify-center items-center flex-1">
                <MoonLoader color="#0071bc" />
            </div>
        </template>
        <ScrollContainer v-else class="pt-2 px-0" @refresh="refreshHandler">
            <ul class="divide-y divide-solid divide-gray">
                <li
                    v-for="(item, index) in list_chat"
                    :key="index"
                    class="px-8 py-2 cursor-pointer"
                    @click="$router.push(`/chat/` + item.id)"
                >
                    <article>
                        <h2 class="font-semibold text-gray-dark text-sm">
                            {{ getName(item) }}
                        </h2>
                        <template v-if="item.messages.length">
                            <p class="text-darkGray text-xs">
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
            >
                <IconAddChat width="25px" height="25px" />
            </button>
        </ScrollContainer>
    </MobileContainer>
</template>
<script setup>
definePageMeta({
    layout: "mobile",
    middleware: ["auth"],
    bottomNavigation: true,
});

const { $user, $chat } = useNuxtApp();

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
    return lastItem?.message;
};

const refreshHandler = () => {
    getRooms();
};

onMounted(() => {
    getRooms();
});
</script>

<style lang="scss"></style>
