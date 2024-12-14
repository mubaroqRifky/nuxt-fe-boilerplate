<template lang="">
    <header
        class="px-6 py-2 flex items-center text-sm justify-between shadow-sm bg-white text-gray-dark"
    >
        <div class="flex">
            <button
                @click="$emit('press')"
                class="bg-white hover:bg-primarySoft hover:text-primary rounded-md p-2 transition-all"
            >
                <IconBar width="20px" height="20px" />
            </button>
        </div>

        <section class="flex gap-2 items-center">
            <div class="hidden md:grid">
                <span
                    class="font-semibold text-gray-200 leading-4 text-primary"
                >
                    {{ user?.name || "John Doe" }}
                </span>
                <p class="text-xs leading-3 text-darkGray lowercase">
                    {{ roles ? roles[0] : "Super User" }}
                </p>
            </div>

            <button
                @click="connfirmLogout"
                class="bg-white hover:bg-primarySoft hover:text-primary rounded-md p-2 ml-4 transition-all"
            >
                <IconLogout width="20px" height="20px" />
            </button>
        </section>
    </header>

    <hr
        class="hidden md:flex h-[3px] border-none w-full rounded-sm"
        style="background-image: linear-gradient(to right, #d9edfb, #f0652500)"
    />
</template>

<script setup>
const app = useNuxtApp();
const router = useRouter();

const { user, roles, removeUser } = useUserStore();

const emit = defineEmits(["press"]);

function connfirmLogout() {
    Modal.confirm("Yakin ingin logout?");
    Modal.onconfirm = () => processLogout();
}

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
</script>

<style lang=""></style>
