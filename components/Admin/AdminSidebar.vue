<template>
    <aside
        class="flex flex-col text-xs transition-all bg-white text-gray-dark shadow-sm z-40"
        :class="open ? 'w-[13rem]' : 'w-[5rem]'"
        :style="getStyleContainer"
    >
        <div
            class="flex gap-2 items-center justify-start px-6 pt-3 pb-2 cursor-pointer"
            @click="$router.push('/')"
        >
            <IconMain class="text-primary" />
            <h1 class="font-bold text-2xl whitespace-nowrap" v-if="open">
                <i class="text-primary">Welcome</i>
            </h1>
        </div>

        <ul
            class="px-4 flex flex-col pb-4 overflow-y-auto scrollbar-secondary gap-2"
            :class="!open && 'pt-4'"
        >
            <template v-for="(item, index) in menu" :key="index">
                <span
                    v-if="open"
                    class="flex gap-1 items-center text-[.7rem] text-darkGray"
                    :class="item.caption ? 'mt-4' : 'mt-1'"
                >
                    <IconCaption
                        v-if="item.caption"
                        width="12px"
                        height="12px"
                    />

                    <span
                        class="mt-[.1rem] tracking-[2px] uppercase text-[.55rem]"
                    >
                        {{ item.caption }}
                    </span>

                    <hr
                        class="w-full border-gray"
                        :class="item.caption ? 'mt-[.2rem] ml-2' : ''"
                    />
                </span>

                <template v-for="(menu, idx) in item.list" :key="idx">
                    <template v-if="menu.child">
                        <li
                            class="list-menu menu-parent justify-between"
                            :class="open ? 'close' : 'show'"
                            @click="showChildHandler(menu)"
                        >
                            <div class="flex items-center gap-1">
                                <LazyIconMenuParent
                                    width="15px"
                                    height="15px"
                                />
                                <span v-if="open">
                                    {{ menu.text }}
                                </span>
                            </div>
                            <LazyIconArrow
                                v-if="open"
                                width="15px"
                                height="15px"
                                class="mt-0.5 transition-all"
                                :class="menu.show ? 'rotate-90' : 'rotate-0'"
                            />
                        </li>
                        <div
                            style="transition: all 0.25s ease"
                            :style="
                                menu.show ? '--height: 100%' : '--height: 0px'
                            "
                            class="child-container"
                        >
                            <ul
                                class="flex-1 flex flex-col gap-2 overflow-hidden h-full"
                            >
                                <li
                                    v-for="(child, i) in menu.child"
                                    :key="i"
                                    class="list-menu"
                                    :class="[
                                        open ? 'close ml-5' : 'show',
                                        $route.name.includes(child.name) &&
                                            'child-active',
                                    ]"
                                >
                                    <nuxt-link
                                        :to="child.link"
                                        :class="open ? '' : 'justify-center'"
                                    >
                                        <span v-if="open">
                                            {{ child.text }}
                                        </span>
                                    </nuxt-link>
                                </li>
                            </ul>
                        </div>
                    </template>

                    <li
                        v-else
                        class="list-menu"
                        :class="open ? 'close' : 'show'"
                    >
                        <nuxt-link
                            :to="menu.link"
                            :class="[
                                open ? '' : 'justify-center',
                                $route.name.includes(menu.name)
                                    ? 'router-link-exact-active'
                                    : '',
                            ]"
                        >
                            <component
                                v-if="menu.icon"
                                :is="menu.icon"
                                width="15px"
                                height="15px"
                            ></component>
                            <span v-if="open">
                                {{ menu.text }}
                            </span>
                        </nuxt-link>
                    </li>
                </template>
            </template>
        </ul>
    </aside>
</template>

<script setup>
import list_menu from "~/static/master_menu";
const menu = ref(list_menu);

const showChildHandler = (menu) => {
    menu.show = !menu.show;
};

let props = defineProps({
    open: {
        type: Boolean,
        default: false,
    },
    view: {
        type: String,
        default: "",
    },
});

const getStyleContainer = computed(() => {
    const position =
        props.view == "mobile" || !props.open ? "fixed h-full" : "relative";
    const transform =
        props.view == "mobile" && !props.open
            ? "translateX(-100%)"
            : "translateX(0)";

    return {
        transition: "all .25s ease",
        position,
        transform,
    };
});
</script>

<style lang="scss" scoped>
.menu-parent {
    @apply transition-all py-3;
    &.close {
        @apply px-4;
    }

    &.show {
        @apply px-3;
    }

    :has(.child-active) & {
        @apply text-primary  font-medium;
    }
}

.child-container {
    height: var(--height);
    :has(.child-active) & {
        --height: 100% !important;
    }
}

.list-menu {
    a {
        &.router-link-active,
        &.router-link-exact-active {
            @apply text-primary bg-primarySoft rounded-md;
        }
    }

    @apply transition-all rounded-md cursor-pointer flex hover:text-primary hover:bg-primarySoft;

    &.close {
        @apply whitespace-nowrap;

        > a {
            @apply px-4 py-3;
        }
    }

    &.show {
        @apply justify-center;

        > a {
            @apply px-2 py-3;
        }
    }

    > a {
        @apply flex items-center gap-1 flex-1;
    }
}

.scroll-hidden::-webkit-scrollbar {
    display: none;
}

.scrollbar-secondary {
    /* width */
    &::-webkit-scrollbar {
        width: 5px;
        height: 5px;
    }

    /* Track */
    &::-webkit-scrollbar-track {
        box-shadow: inset 0 0 5px #dadada;
        border-radius: 10px;
    }

    /* Handle */
    &::-webkit-scrollbar-thumb {
        background: rgb(206, 206, 206);
        border-radius: 10px;
    }

    /* Handle on hover */
    &::-webkit-scrollbar-thumb:hover {
        background: rgb(194, 194, 194);
    }
}
</style>
