<template>
    <div class="flex w-screen h-screen">
        <LazyMainSplashScreen v-if="splash_show" />

        <span
            class="backdrop"
            :class="view == 'mobile' && sidebar ? 'z-30' : '-z-40'"
            @click="sidebarHandler"
        />

        <AdminSidebar
            :open="sidebar"
            :view="view"
            @change-sidebar="sidebarHandler"
        />

        <main
            class="flex-1 flex flex-col bg-white text-gray-dark overflow-hidden"
            :class="[
                view == 'mobile' && '-ml-20',
                view == 'mobile' && sidebar && 'ml-0 absolute left-0 right-0',
            ]"
        >
            <AdminHeader @press="sidebarHandler" />
            <section
                class="px-6 py-6 flex-1 overflow-auto bg-[#0071bc0a] flex flex-col"
            >
                <slot />
            </section>
        </main>

        <Transition name="ghost">
            <LazyMainModal
                v-if="modal.show"
                :content="modal.content"
                :subcontent="modal.subcontent"
                :type="modal.type"
                @close="Modal.close"
                @proses="Modal.onconfirm"
            />
        </Transition>
    </div>
</template>

<script setup>
const sidebar = ref(true);
const splash_show = ref(true);

const modal = Modal.getModal;

const sidebarHandler = () => {
    sidebar.value = !sidebar.value;
};

const view = ref(null);
const setView = (element) => {
    let result = false;

    if (element.innerWidth > 768) {
        view.value = "desktop";
        result = true;
    } else if (element.innerWidth > 425) {
        view.value = "tablet";
        result = false;
    } else {
        view.value = "mobile";
        result = false;
    }

    sidebar.value = result;
};

const resizeHandler = (evt) => setView(evt.target);

onMounted(() => {
    splash_show.value = true;
    window.addEventListener("resize", resizeHandler);
    setView(window);

    setTimeout(() => {
        splash_show.value = false;
    }, 2000);
});

onUnmounted(() => {
    window.removeEventListener("resize", resizeHandler);
});
</script>

<style lang="scss" scoped>
.backdrop {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.201);
    position: fixed;
}
</style>
