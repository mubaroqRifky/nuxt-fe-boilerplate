<template>
    <div class="flex flex-col relative">
        <div class="flex flex-col gap-1">
            <span
                v-if="label"
                class="text-xs"
                :class="[
                    theme == 'primary' ? 'font-medium' : 'text-primary',
                    labelColor == 'primary' ? 'text-primary' : '',
                ]"
            >
                {{ label }} <i v-if="required" class="text-danger text-xs">*</i>
            </span>

            <label
                v-if="theme == 'primary'"
                class="border border-solid px-4 pr-1 py-2 text-xs flex items-center cursor-pointer outline-offset-[3px] focus:outline-primaryTransparent focus:border-primaryTransparent"
                :class="[
                    disabled
                        ? 'bg-lightGray border-lightGray rounded-md'
                        : theme == 'primary'
                        ? `bg-primarySoft border-primarySoft placeholder:text-primaryDark text-primaryDark rounded-md`
                        : `border-gray bg-white rounded-xl`,
                    error && 'input-error',
                ]"
                @keyup.space.prevent="openHandler"
                @keyup.enter.prevent="openHandler"
            >
                <input
                    @click.prevent="openHandler"
                    ref="input_selection"
                    type="text"
                    :value="getValue"
                    readonly
                    :placeholder="placeholder"
                    class="w-full outline-none cursor-pointer p-0.5"
                    :class="[
                        disabled
                            ? 'bg-lightGray'
                            : theme == 'primary'
                            ? `bg-primarySoft border-primarySoft placeholder:text-primaryDark text-primaryDark  `
                            : `border-gray bg-white`,
                        error && 'input-select-error',
                    ]"
                    :style="[error ? 'background: none;' : '']"
                />
                <IconArrowCurveDown
                    class="transform transition text-primaryDark"
                    :class="show_list ? 'rotate-180' : ''"
                    width="20px"
                    height="20px"
                />
            </label>
            <label
                v-if="theme == 'secondary'"
                class="bg-white border border-solid border-white shadow-xl px-5 pr-3 py-2 rounded-xl text-sm flex items-center cursor-pointer"
            >
                <input
                    @click.prevent="openHandler"
                    ref="input_selection"
                    type="text"
                    :value="getValue"
                    readonly
                    :placeholder="placeholder"
                    class="bg-white w-full outline-none cursor-pointer"
                />
                <IconArrowCurveDown
                    class="transform transition text-primaryDark"
                    :class="show_list ? 'rotate-180' : ''"
                    width="20px"
                    height="20px"
                />
            </label>
            <label
                tabindex="0"
                v-if="theme == 'default'"
                class="border border-solid border-gray px-5 pr-3 py-3 rounded-xl text-sm flex items-center cursor-pointer outline-offset-[3px] focus:outline-primaryTransparent focus:border-primaryTransparent"
                :class="[
                    disabled ? 'bg-lightGray' : 'bg-white',
                    error && 'input-error',
                ]"
                @keyup.space.prevent="openHandler"
                @keyup.enter.prevent="openHandler"
            >
                <input
                    tabindex="-1"
                    @click.prevent="openHandler"
                    ref="input_selection"
                    type="text"
                    :value="getValue"
                    readonly
                    :placeholder="placeholder"
                    class="w-full outline-none cursor-pointer"
                    :class="[disabled ? 'bg-lightGray' : 'bg-white']"
                    :style="[error ? 'background: none;' : '']"
                />

                <IconSearch
                    v-if="icon == 'search'"
                    width="30"
                    height="20"
                    class="text-darkGray"
                />
                <IconArrowCurveDown
                    v-else
                    class="transform transition text-darkGray"
                    :class="show_list ? 'rotate-180' : ''"
                    width="20px"
                    height="20px"
                />
            </label>
        </div>

        <p v-if="!noValidity" class="text-danger text-[.7rem] mt-1.5 mx-1">
            {{ error || "&nbsp;" }}
        </p>

        <Transition name="ghost">
            <section
                v-if="show_list"
                class="mobile-width-constraint fixed stack-modal top-0 left-0 right-0 bottom-0 bg-transparent z-20"
                @click.self.stop="closeHandler"
                @keyup.escape="closeHandler"
            >
                <Transition name="slideup">
                    <div
                        v-if="bodyShow"
                        ref="pullContainer"
                        class="bg-white absolute bottom-0 left-0 right-0 rounded-t-2xl pt-2 flex flex-col max-h-[70vh]"
                        :class="title ? 'min-h-[45vh]' : ''"
                    >
                        <div v-if="touchable" ref="pullElement" class="py-2">
                            <hr
                                class="border-2 border-gray w-12 mx-auto pointer-events-none"
                            />
                        </div>
                        <div
                            v-if="title"
                            class="px-6 py-4 shadow-md pointer-events-none"
                        >
                            <h2 class="font-semibold">
                                {{ title }}
                            </h2>
                        </div>
                        <div
                            v-if="search"
                            class="px-4 py-4 border-b border-solid border-softGray"
                            ref="input"
                        >
                            <InputText
                                theme="default"
                                placeholder="Search"
                                no-validity
                                type="search"
                                ref="refs"
                                v-model="searchValue"
                                @update:modelValue="searchHandler"
                            />
                        </div>
                        <div
                            class="flex flex-col text-sm overflow-auto flex-1 scrollbar-secondary"
                        >
                            <label
                                v-for="(item, index) in getOptions"
                                class="px-6 py-4 flex gap-2 items-center cursor-pointer"
                                :class="[
                                    index < getOptions.length - 1
                                        ? 'border-b border-solid border-gray'
                                        : '',
                                    isListSelected(item)
                                        ? 'bg-softGray text-darkGray cursor-not-allowed'
                                        : '',
                                ]"
                                @click.prevent="
                                    !isListSelected(item)
                                        ? itemSelectedHandler(item)
                                        : () => {}
                                "
                            >
                                <span class="flex-1">
                                    {{ item[optionLabel] }}
                                </span>
                                <input
                                    v-if="!isListSelected(item)"
                                    class="outline-none pointer-events-none"
                                    type="radio"
                                    :name="label + placeholder"
                                    :value="reduce(item)"
                                    :checked="
                                        findItem(item, temp_value, optionKey)
                                    "
                                />
                            </label>

                            <div
                                class="h-20"
                                v-if="!getOptions.length && !loading"
                            >
                                <p
                                    class="px-6 py-3 flex gap-2 items-center text-gray"
                                >
                                    Tidak ada data.
                                </p>
                            </div>

                            <div
                                v-if="hasNextPage || loading"
                                ref="load"
                                class="flex justify-center items-center"
                            >
                                <div
                                    class="px-6 py-2"
                                    :class="!getOptions.length ? 'my-4' : ''"
                                >
                                    <BeatLoader color="#a9dcff" />
                                </div>
                            </div>
                        </div>

                        <slot name="action"></slot>

                        <div
                            class="flex gap-4 items-center px-6 py-4 border-t border-solid border-gray text-md"
                            style="
                                box-shadow: 0px -1px 10px -2px
                                    rgba(0, 0, 0, 0.2);
                            "
                        >
                            <button
                                class="bg-white text-primary border border-primary border-solid rounded-full px-4 py-3 min-w-20 flex-1"
                                @click.prevent="resetHandler"
                                aria-label="Button Reset"
                            >
                                Reset
                            </button>
                            <button
                                class="bg-primary text-white border border-primary border-solid rounded-full px-4 py-3 min-w-20 flex-1"
                                @click.prevent="selectHandler"
                                aria-label="Button Select"
                                :disabled="checkIsEmptyValue(temp_value)"
                            >
                                Pilih
                            </button>
                        </div>
                    </div>
                </Transition>
            </section>
        </Transition>
    </div>
</template>

<script setup>
const props = defineProps({
    title: {
        type: String,
        default: "",
    },
    label: {
        type: String,
        default: "",
    },
    labelColor: {
        type: String,
        default: "",
    },
    placeholder: {
        type: String,
        default: "",
    },
    error: {
        type: String,
        default: "",
    },
    theme: {
        type: String,
        default: "default",
    },
    icon: {
        type: String,
        default: "default",
    },
    touchable: {
        type: Boolean,
        default: false,
    },
    search: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    required: {
        type: Boolean,
        default: false,
    },
    noValidity: {
        type: Boolean,
        default: false,
    },
    optionLabel: {
        type: String,
        default: "text",
    },
    optionKey: {
        default: function () {
            return ["value", "id"];
        },
    },
    searchKey: {
        default: function () {
            return ["name", "id", "text", "value"];
        },
    },
    options: {
        type: Array,
        default: function () {
            return [];
        },
    },
    createOption: {
        type: Function,
        default: function (val) {
            return val;
        },
    },
    reduce: {
        type: Function,
        default: function (val) {
            return val;
        },
    },
    loading: {
        type: Boolean,
        default: false,
    },
    hasNextPage: {
        type: Boolean,
        default: false,
    },
    mode: {
        type: String,
        default: "server",
    },
    hasSelected: {
        type: Array,
        default: function () {
            return [];
        },
    },
    lastDescription: {
        default: "",
    },
});

const isListSelected = (item) => {
    const exist = props.hasSelected.some((v) => {
        const value = v?.[props.optionKey] || v;
        return value == item[props.optionKey];
    });

    return exist;
};

const value = defineModel();
const searchValue = ref(null);
const emit = defineEmits([
    "update:error",
    "close",
    "selected",
    "scroll",
    "search",
    "reset",
]);
const show_list = ref(false);
const bodyShow = ref(false);
const selected = ref(null);
const refs = ref(null);
const load = ref(null);
const observer = ref(null);
const debounce = ref(null);
const input_selection = ref(null);

defineExpose({
    input_selection,
});

watch(
    () => value,
    (newValue) => {
        emit("update:error");
        temp_value.value = newValue.value;
    },
    { deep: true }
);

const findItem = (item = {}, value, container = []) => {
    if (checkIsEmptyValue(value)) return false;

    if (typeof container == "object" && container.hasOwnProperty("length")) {
        for (let i = 0; i < container.length; i++) {
            const key = container[i];
            if (checkIsEmptyValue(item[key])) {
                continue;
            }
            if (item[key] == (value[key] || value)) return true;
        }

        return false;
    }

    return item[container] == (value[container] || value);
};

const checkIsEmptyValue = (value) => {
    return value === "" || value === undefined || value === null;
};

const getValue = computed(() => {
    try {
        const { options, optionKey, optionLabel, reduce, createOption } = props;
        const { value: val } = value;

        if (checkIsEmptyValue(val)) return "";

        switch (typeof val) {
            case "string":
            case "number":
            case "boolean":
                const result = options
                    .map(createOption)
                    .find((v) => findItem(v, val, optionKey));

                return result
                    ? result[optionLabel]
                    : temp_desc.value || value.value || "";
            case "object":
                return reduce(val)[optionLabel];
            default:
                return val;
        }
    } catch (error) {
        console.error(error);
    }
});

const focusSearchInput = () => {
    if (!props.search) return;
    setTimeout(() => refs.value.input.focus(), 0);
};

const closeModal = (e) => {
    if (e.key == "Escape") closeHandler();
};

const openHandler = () => {
    if (props.disabled) return;
    show_list.value = true;
    setTimeout(() => {
        bodyShow.value = true;
        focusSearchInput();
    }, 0);

    if (props.touchable) {
        setTimeout(() => {
            implementPullToRefresh();
        }, 150);
    }

    document.body.addEventListener("keydown", closeModal);
    regisObserver();
};
const closeHandler = () => {
    bodyShow.value = false;
    setTimeout(() => {
        show_list.value = false;
    }, 250);

    document.body.removeEventListener("keydown", closeModal);
    unRegisObserver();
};

watch(
    () => props.hasNextPage,
    (newValue) => {
        if (newValue === true) regisObserver();
        if (newValue === false) unRegisObserver();
    }
);

watch(
    () => props.lastDescription,
    (newValue) => {
        temp_desc.value = newValue;
    }
);

const temp_value = ref(value.value);
const temp_desc = ref(props.lastDescription);
const itemSelectedHandler = (item) => {
    temp_value.value = props.reduce(item);
    temp_desc.value = item[props.optionLabel];
};

const resetHandler = () => {
    selected.value = null;
    temp_value.value = null;
    temp_desc.value = null;
    value.value = null;
    emit("reset");
    closeHandler();
};

const selectHandler = () => {
    if (!checkIsEmptyValue(temp_value.value)) {
        value.value = temp_value.value;
        emit("selected", temp_value.value);
        closeHandler();
    }
};

const infiniteScroll = async ([{ isIntersecting, target }]) => {
    if (isIntersecting && !props.loading) emit("scroll");
};

const searchHandler = () => {
    if (props.loading) return;
    if (props.mode == "client") {
        searchClient(searchValue.value);
        return;
    }

    clearTimeout(debounce.value);
    debounce.value = setTimeout(() => {
        emit("search", searchValue.value);
    }, 800);
};

const temp_options = ref(props.options);
watch(
    () => props.options,
    (newValue) => {
        if (props.mode == "client") temp_options.value = newValue;
    }
);
const getOptions = computed(() => {
    try {
        const { mode, options, createOption } = props;

        if (mode == "client") return temp_options.value.map(createOption);
        return options.map(createOption);
    } catch (error) {
        console.error(error);
    }
});

const searchClient = (value) => {
    try {
        const { options, createOption, searchKey } = props;
        const regexp = new RegExp(value, "ig");
        const result = options.map(createOption).filter((v) => {
            if (
                typeof searchKey == "object" &&
                searchKey.hasOwnProperty("length")
            ) {
                for (let i = 0; i < searchKey.length; i++) {
                    const key = searchKey[i];
                    if (String(v[key]).match(regexp)) return true;
                }

                return false;
            }

            return String(v[searchKey]).match(regexp);
        });
        temp_options.value = result;
    } catch (error) {
        console.error(error);
    }
};

const regisObserver = () => {
    setTimeout(() => {
        observer.value = new IntersectionObserver(infiniteScroll);
        if (load.value) observer.value.observe(load.value);
    }, 0);
};

const unRegisObserver = () => {
    setTimeout(() => {
        if (observer.value) observer.value.disconnect();
    }, 250);
};

const pullContainer = ref(null);
const pullElement = ref(null);

let touchstartY = 0;
let touchDiff = 0;
let touchStartTime = 0;
let touchEndTime = 0;

const startTouchHandler = (e) => {
    touchstartY = e.touches[0].clientY;
    touchStartTime = e.timeStamp;
};

const moveTouchHandler = (e) => {
    const touchY = e.touches[0].clientY;
    touchDiff = touchY - touchstartY;

    if (e.target != pullElement.value) return;

    if (touchDiff > 10 && e.cancelable) {
        pullContainer.value.style.transform = `translateY(${touchDiff}px)`;
    }

    e.preventDefault();
};

const endTouchHandler = (e) => {
    touchEndTime = e.timeStamp;

    if (e.target != pullElement.value) return;

    if (touchDiff > 150) {
        closeHandler();
    } else {
        pullContainer.value.style.transform = `translateY(${0}px)`;
    }

    e.preventDefault();
};

const implementPullToRefresh = () => {
    if (pullContainer.value && pullContainer.value.addEventListener) {
        pullContainer.value.addEventListener("touchstart", startTouchHandler);
        pullContainer.value.addEventListener("touchmove", moveTouchHandler);
        pullContainer.value.addEventListener("touchend", endTouchHandler);
    }
};

const removePullToRefresh = () => {
    pullContainer.value.removeEventHandler("touchstart", startTouchHandler);
    pullContainer.value.removeEventHandler("touchmove", moveTouchHandler);
    pullContainer.value.removeEventHandler("touchend", endTouchHandler);
};

onUnmounted(() => {
    if (pullContainer.value && pullContainer.value.removeEventHandler) {
        removePullToRefresh();
    }
});
</script>

<style lang="scss" scoped>
.input-error {
    border-color: red !important;
    outline-color: #ff000038 !important;
    background: #ff00000d !important;
}
</style>
