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
        </ScrollContainer>
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
        loadDataStart();
        const { data, meta } = await $user.getAll(params_user);
        list_users.value = data;
        userHasNextPage.value = meta?.to < meta?.total;
    } catch (error) {
        throw new ErrorHandler(error);
    } finally {
        loadDataStop();
    }
};

const list_rooms = ref([]);
const getAllRooms = async () => {
    try {
        const data = await $metered.getAllRoom();
        list_rooms.value = data;
    } catch (error) {
        throw new ErrorHandler(error);
    }
};

onMounted(() => {
    getAllRooms();
    getUsers();
});

onBeforeUnmount(() => {});
</script>

<style lang="scss"></style>
