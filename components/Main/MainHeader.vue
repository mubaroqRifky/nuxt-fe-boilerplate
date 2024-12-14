<template lang="">
    <header
        class="px-6 py-0 flex items-center text-sm justify-between border-b border-solid border-gray shadow-md bg-white text-gray-dark z-[1]"
    >
        <div class="flex gap-4 items-center">
            <button
                @click="$emit('press')"
                class="bg-white hover:bg-[#079cff26] hover:text-primary rounded-md p-1.5 transition-all outline-none"
            >
                <IconBar width="20px" height="20px" />
            </button>

            <div
                class="hidden md:block md:min-w-60 xl:min-w-72"
                v-if="isSearchShowing"
            >
                <label
                    class="text-xs text-darkGray bg-softGray flex gap-2 items-center rounded-md px-2 border border-solid border-lightGray focus-within:bg-white focus-within:border-primaryLight focus-within:outline-offset-1 outline-primaryTransparent focus-within:outline outline-1"
                >
                    <IconSearch width="15px" height="15px" />
                    <input
                        class="outline-none py-2 bg-softGray rounded-md w-full focus:bg-white"
                        type="search"
                        placeholder="Pencarian"
                        v-model="searchValue"
                        @search="searchHandler"
                    />
                </label>
            </div>
        </div>

        <section class="flex gap-4 py-3 xl:pl-14 items-center">
            <button
                @click="confirmLogout"
                class="bg-softGray hover:bg-[#079cff26] hover:text-primary rounded-full p-2 transition-all outline-none"
            >
                <IconLogout width="18px" height="18px" />
            </button>
        </section>
    </header>
</template>

<script setup>
const app = useNuxtApp();
const router = useRouter();
const route = useRoute();

const { user, roles, removeUser } = useUserStore();

const emit = defineEmits(["press"]);

const isSearchShowing = computed(() => {
    switch (route.name) {
        case "index":
        case "order":
        case "delivery":
        case "status-order":
        case "quality-check":
            return true;
        default:
            return false;
    }
});

const getDateLocale = computed(() => {
    const dateTime = new Date();

    const localeDate = dateTime.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return localeDate;
});

const confirmLogout = () => {
    Modal.confirm("Yakin ingin logout?");
    Modal.onconfirm = () => processLogout();
};

const processLogout = async () => {
    try {
        loadingStart();
        await app.$auth.logout();
        Modal.close();
    } catch (error) {
        throw new ErrorHandler(error);
    } finally {
        loadingStop();
        router.replace("/login");
        removeUser();
    }
};

const searchValue = ref("");
const searchHandler = () => {
    const channel = new BroadcastChannel("header-search");
    channel.postMessage({ message: searchValue.value });
};

watch(route, () => {
    searchValue.value = "";
});
</script>

<style lang="scss" scoped></style>
