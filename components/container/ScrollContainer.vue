<template>
    <section
        ref="pullContainer"
        class="pull-container relative px-6 pt-6 overflow-auto scroll-hidden flex-1 flex flex-col gap-10"
        :class="$route.meta.bottomNavigation ? 'pb-20' : 'pb-6'"
    >
        <div ref="pullToRefresh" class="pull-to-refresh">
            <div
                class="bg-white rounded-full w-[40px] h-[40px] shadow-lg flex justify-center items-center"
            >
                <MoonLoader size="30px" color="#004b7c" />
            </div>
        </div>
        <slot></slot>
    </section>
</template>

<script setup>
let touchstartY = 0;
let touchDiff = 0;
let touchStartTime = 0;
let touchEndTime = 0;

const pullContainer = ref(null);
const pullToRefresh = ref(null);

const emit = defineEmits(["refresh"]);

const startTouchHandler = (e) => {
    const fixedElementIsOpen = document.querySelector(".fixed");
    if (fixedElementIsOpen && fixedElementIsOpen.tagName != "FOOTER") return;

    touchstartY = e.touches[0].clientY;
    touchStartTime = e.timeStamp;
};
const moveTouchHandler = (e) => {
    const touchY = e.touches[0].clientY;
    touchDiff = touchY - touchstartY;

    if (touchDiff > 0 && pullContainer.value.scrollTop === 0 && e.cancelable) {
        pullToRefresh.value.classList.add("visible");
        pullContainer.value.classList.add("visible");
        e.preventDefault();
    }
};
const endTouchHandler = (e) => {
    touchEndTime = e.timeStamp;

    if (pullToRefresh.value.classList.contains("visible")) {
        pullToRefresh.value.classList.remove("visible");
        pullContainer.value.classList.remove("visible");

        if (touchDiff > 100 && touchEndTime - touchStartTime > 300) {
            emit("refresh");
        }
    }
};

const implementPullToRefresh = () => {
    if (pullContainer.value && pullContainer.value.addEventListener) {
        pullContainer.value.addEventListener("touchstart", startTouchHandler);
        pullContainer.value.addEventListener("touchmove", moveTouchHandler);
        pullContainer.value.addEventListener("touchend", endTouchHandler);
    }
};

onMounted(() => {
    implementPullToRefresh();
});

onUnmounted(() => {
    if (pullContainer.value && pullContainer.value.removeEventHandler) {
        pullContainer.value.removeEventHandler("touchstart", startTouchHandler);
        pullContainer.value.removeEventHandler("touchmove", moveTouchHandler);
        pullContainer.value.removeEventHandler("touchend", endTouchHandler);
    }
});
</script>

<style lang="scss">
.pull-container {
    top: 0;
    transition: top 0.2s ease-in-out;
}
.pull-to-refresh {
    z-index: 1;
    position: absolute;
    top: -20%;
    left: 0;
    right: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: top 0.25s ease-in-out;
}
.pull-to-refresh.visible {
    top: 0%;
}
.pull-container.visible {
    top: 4%;
}
</style>
