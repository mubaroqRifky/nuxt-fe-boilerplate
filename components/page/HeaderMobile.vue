<template>
    <header
        class="flex items-center justify-between px-6 text-white z-[1]"
        :class="
            theme == 'default'
                ? 'border-b border-solid border-lightGray h-14'
                : 'linear-primary h-16'
        "
    >
        <div
            class="flex gap-4 items-center"
            :class="theme == 'default' ? 'text-black' : ''"
        >
            <button
                v-if="!$route.meta.bottomNavigation && canBack"
                @click="backRouterHandler"
                aria-label="Button Back"
                id="button-back"
            >
                <IconArrowBack width="25" height="25" />
            </button>
            <h1
                class="font-semibold text-base leading-4 text-elipsis flex-1"
                :class="theme == 'default' ? 'ml-2' : ''"
            >
                {{ title }}
            </h1>
        </div>
        <div>
            <button
                v-if="actionShow && actionTitle"
                class="text-sm flex items-center gap-1 whitespace-nowrap"
                @click="$emit('action')"
            >
                <IconPlus
                    width="20px"
                    height="20px"
                    v-if="actionType == 'create'"
                />
                <IconRefresh
                    :class="loading ? 'rotate' : ''"
                    width="18px"
                    height="18px"
                    v-else-if="actionType == 'sync'"
                />
                {{ actionTitle }}
            </button>
        </div>

        <div
            v-if="linear"
            class="linear-primary absolute top-0 left-0 right-0 h-[10rem] scale-[1] rounded-b-4xl z-[-1]"
            ref="headerBackground"
        ></div>
    </header>
</template>

<script setup>
const props = defineProps({
    title: {
        type: String,
        default: "Default Header",
    },
    actionTitle: {
        type: String,
        default: "",
    },
    actionShow: {
        type: Boolean,
        default: true,
    },
    canBack: {
        type: Boolean,
        default: true,
    },
    linear: {
        type: Boolean,
        default: false,
    },
    loading: {
        type: Boolean,
        default: false,
    },
    actionType: {
        type: String,
        default: "",
    },
    theme: {
        type: String,
        default: "primary",
    },
    backHandler: {
        default: null,
    },
});

const emit = defineEmits(["action"]);
const router = useRouter();

const backRouterHandler = () => {
    if (props.backHandler && typeof props.backHandler == "function") {
        props.backHandler();
    } else {
        router.back();
    }
};

const headerBackground = ref(null);
defineExpose({
    headerBackground,
});
</script>

<style lang=""></style>
