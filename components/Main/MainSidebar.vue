<template>
    <aside
        class="flex flex-col text-xs transition-all bg-white text-gray-dark shadow-sm z-40 border-r border-solid border-gray"
        :class="open ? 'w-[13.5rem]' : 'w-[5rem]'"
        :style="getStyleContainer"
    >
        <div
            class="flex gap-2 items-center px-5 pt-5 pb-5 cursor-pointer"
            @click="$router.push('/')"
        >
            <div
                class="whitespace-nowrap flex gap-2 justify-center items-center"
                v-if="open"
            >
                <IconMain width="22px" height="22px" class="text-primary" />
                <h1 class="font-bold text-base text-primaryDark">
                    Nuxt Starter
                </h1>
            </div>
            <div
                class="flex justify-center items-center w-full text-primaryDark"
                v-else
            >
                <IconMain width="25px" height="25px" class="text-primary" />
            </div>
        </div>

        <ul
            class="flex flex-col pb-4 overflow-y-auto scrollbar-secondary gap-2 pt-2 px-4 flex-1"
        >
            <template v-for="(item, index) in menu" :key="index">
                <span
                    v-if="open && item.caption"
                    class="flex gap-3 items-center text-[.7rem] text-darkGray"
                    :class="item.caption ? 'mt-1 pl-2' : 'mt-1'"
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
                        :class="item.caption ? 'mt-[.2rem] ml-2' : 'hidden'"
                    />
                </span>

                <template v-for="(menu, idx) in item.list" :key="idx">
                    <template v-if="menu.child">
                        <li
                            v-if="canAccessMenu(menu.permit)"
                            class="list-menu menu-parent justify-between"
                            :class="[
                                open ? 'close' : 'show',
                                menu.show ? 'bg-primary' : '',
                                isParentActive(menu) ? '' : '',
                            ]"
                            @click="showChildHandler(menu)"
                        >
                            <div
                                class="flex items-center gap-3"
                                :class="menu.show ? 'text-white' : ''"
                            >
                                <component
                                    v-if="menu.icon"
                                    :is="menu.icon"
                                    width="22px"
                                    height="22px"
                                ></component>
                                <LazyIconMenuParent
                                    v-else
                                    width="20px"
                                    height="20px"
                                />
                                <p v-if="open">
                                    {{ menu.text }}
                                </p>
                            </div>
                            <LazyIconArrow
                                v-if="open"
                                width="15px"
                                height="15px"
                                class="mt-[2.5px] transition-all"
                                :class="menu.show ? 'rotate-90' : 'rotate-0'"
                            />
                        </li>
                        <div
                            v-if="canAccessMenu(menu.permit)"
                            style="transition: all 0.25s ease"
                            :style="
                                menu.show ? '--height: 100%' : '--height: 0px'
                            "
                            class="child-container"
                            :class="
                                menu.show ? 'bg-primaryLight pb-4 pt-2' : ''
                            "
                        >
                            <ul
                                class="flex-1 flex flex-col gap-2 overflow-hidden h-full border-solid border-gray"
                            >
                                <template
                                    v-for="(child, i) in menu.child"
                                    :key="i"
                                >
                                    <li
                                        v-if="canAccessMenu(child.permit)"
                                        class="list-menu-child"
                                        :class="[open ? 'close' : 'show']"
                                    >
                                        <nuxt-link
                                            :to="child.link"
                                            :class="
                                                open ? '' : 'justify-center'
                                            "
                                        >
                                            <component
                                                v-if="child.icon"
                                                :is="child.icon"
                                                :width="child.width || '22px'"
                                                :height="child.height || '22px'"
                                            ></component>
                                            <p v-if="open">
                                                {{ child.text }}
                                            </p>
                                        </nuxt-link>
                                    </li>
                                </template>
                            </ul>
                        </div>
                    </template>

                    <template v-else>
                        <li
                            v-if="canAccessMenu(menu.permit)"
                            class="list-menu"
                            :class="open ? 'close' : 'show'"
                        >
                            <nuxt-link
                                :to="menu.link"
                                :class="[
                                    open ? '' : 'justify-center',
                                    $route.name &&
                                    $route.name?.includes(menu.name)
                                        ? 'router-link-exact-active'
                                        : '',
                                ]"
                            >
                                <component
                                    v-if="menu.icon"
                                    :is="menu.icon"
                                    width="22px"
                                    height="22px"
                                ></component>
                                <p v-if="open">
                                    {{ menu.text }}
                                </p>
                            </nuxt-link>
                        </li>
                    </template>
                </template>
            </template>
        </ul>

        <div class="flex items-center gap-1 bottom-0 left-0 px-3 py-3">
            <div class="flex relative">
                <IconCpp width="49px" height="50px" />
            </div>

            <article
                class="text-[.5rem] leading-3 whitespace-nowrap overflow-hidden"
                :class="open ? '' : 'hidden'"
            >
                <p>Development & maintenance by</p>
                <p class="font-semibold text-[.55rem]">
                    PT Central Proteina Prima, Tbk
                </p>
            </article>
        </div>
    </aside>
</template>

<script setup>
import list_menu from "~/static/main_menu";
const menu = ref(list_menu);

const props = defineProps({
    open: {
        type: Boolean,
        default: false,
    },
    view: {
        type: String,
        default: "",
    },
});

const route = useRoute();

const isParentActive = (menu) => {
    if (!menu.child) return;

    const result = menu.child.some(
        (val) => route.name && route.name.includes(val.name)
    );

    if (result) menu.show = true;

    return result;
};

const showChildHandler = async (menu) => {
    menu.show = !menu.show;
};

const canAccessMenu = (permit) => {
    if (!permit || !permit.length) return true;
    return can(permit);
};

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
    @apply transition-all py-2;
    &.close {
        @apply pl-2 pr-2;
    }

    &.show {
        @apply px-4;
    }

    :has(.child-active) & {
        @apply text-white bg-primary font-normal;
    }
}

.child-container {
    @apply max-h-fit -mt-2;

    height: var(--height);
    :has(.child-active) & {
        /* --height: 100% !important; */
    }

    .list-menu-child {
        @apply hover:bg-none;

        &.close {
            @apply whitespace-nowrap;

            > a {
                @apply px-4 py-2;
            }
        }

        &.show {
            @apply justify-center;

            > a {
                @apply px-4 py-2;
            }
        }

        > a {
            @apply flex items-center gap-2 flex-1;

            &.router-link-active,
            &.router-link-exact-active {
                @apply text-primary;
                background: none !important;
            }
        }
    }
}

.list-menu {
    a {
        &.router-link-active,
        &.router-link-exact-active {
            @apply text-white bg-primary rounded-md;

            span {
                @apply text-white bg-primary;
            }
        }
    }

    @apply font-normal text-darkGray transition-all rounded-md cursor-pointer flex hover:text-white hover:bg-primary;

    &:hover {
        span {
            @apply text-white;
        }
    }

    > span {
        @apply text-darkGray;
    }

    &.close {
        @apply whitespace-nowrap;

        > a {
            @apply px-2 py-2;
        }
    }

    &.show {
        @apply justify-center;

        > a {
            @apply px-4 py-2;
        }
    }

    > a {
        @apply flex items-center gap-2 flex-1;
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
