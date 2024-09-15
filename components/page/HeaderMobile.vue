<template>
    <header
        class="flex items-center gap-1 justify-between px-6 text-white z-10"
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
            >
                <IconArrowBack width="25" height="25" />
            </button>

            <div
                class="flex flex-col"
                :class="theme == 'default' ? 'ml-2' : ''"
            >
                <h1
                    class="font-semibold text-base leading-4 text-elipsis flex-1"
                >
                    {{ title }}
                </h1>
                <p
                    v-if="subtitle"
                    class="text-darkGray text-xs text-elipsis elipsis-1"
                >
                    {{ subtitle }}
                </p>
            </div>
        </div>
        <div :class="theme == 'default' ? 'text-black' : ''">
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
                <IconThreeDots
                    :class="loading ? 'rotate' : ''"
                    width="18px"
                    height="18px"
                    v-else-if="actionType == 'option'"
                />
                {{ actionTitle }}
            </button>
        </div>
    </header>
</template>

<script setup>
const props = defineProps({
    title: {
        type: String,
        default: "Title",
    },
    subtitle: {
        type: String,
        default: "",
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
</script>

<style lang=""></style>
