<template>
    <div class="flex flex-col relative">
        <div class="flex flex-col gap-1">
            <span v-if="label" class="text-xs text-primary">
                {{ label }} <i v-if="required" class="text-danger text-xs">*</i>
            </span>

            <label
                tabindex="0"
                class="input-select default"
                :class="[disabled && 'disabled', error && 'input-error']"
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
                />

                <IconSearch
                    v-if="icon == 'search' && !getValue"
                    width="30"
                    height="20"
                    class="text-darkGray"
                />
                <template v-else>
                    <IconArrow
                        v-if="!value"
                        class="transform transition text-darkGray"
                        :class="
                            show_list ? '-rotate-[90deg]' : 'rotate-[90deg]'
                        "
                        width="20px"
                        height="20px"
                    />
                </template>

                <button class="text-darkGray z-10 absolute right-1.5">
                    <IconClose
                        @click="resetHandler"
                        v-if="value && !disabled"
                        width="18px"
                        height="18px"
                    />
                </button>
            </label>
        </div>

        <p v-if="!noValidity" class="text-danger text-[.7rem] mt-1 mx-1 flex-1">
            {{ error || "&nbsp;" }}
        </p>

        <div
            v-if="bodyShow"
            class="bg-white shadow-md rounded-t-md rounded-b-md flex flex-col absolute top-full w-full z-20 border border-solid border-lightGray"
            :class="[
                title ? 'min-h-[400px]' : '',
                noValidity ? 'mt-1' : '-mt-3',
            ]"
        >
            <div v-if="title" class="px-6 py-4 shadow-md">
                <h2 class="font-semibold">{{ title }}</h2>
            </div>
            <label
                v-if="search"
                class="px-2 py-2 border-b border-solid border-softGray text-xs"
                ref="input"
            >
                <InputText
                    size="extra-small"
                    theme="default"
                    :rounded="false"
                    placeholder="Search"
                    no-validity
                    type="search"
                    ref="refs"
                    v-model="searchValue"
                    @update:modelValue="searchHandler"
                />
            </label>
            <ul
                class="flex flex-col text-xs max-h-[30vh] overflow-auto flex-1 scrollbar-secondary divide-y divide-solid divide-softGray"
            >
                <template v-for="(item, index) in getOptions" :key="index">
                    <li
                        class="px-4 py-2.5 flex gap-2 items-center cursor-pointer hover:bg-[#CEEBFF]"
                        :class="[
                            isListSelected(item)
                                ? 'bg-softGray text-darkGray cursor-not-allowed'
                                : '',
                        ]"
                        @click.prevent="itemSelectedHandler(item)"
                    >
                        <span class="flex-1">
                            {{ item[optionLabel] }}
                        </span>
                        <input
                            v-if="false"
                            class="outline-none pointer-events-none"
                            type="radio"
                            :name="label + placeholder"
                            :value="reduce(item)"
                            :checked="findItem(item, temp_value, optionKey)"
                        />
                    </li>
                </template>

                <li class="h-20" v-if="!getOptions.length && !loading">
                    <p class="px-6 py-3 flex gap-2 items-center text-gray">
                        Tidak ada data.
                    </p>
                </li>

                <li
                    v-if="hasNextPage || loading"
                    ref="load"
                    class="flex justify-center items-center"
                >
                    <p
                        class="px-6 py-2 text-gray"
                        :class="!getOptions.length ? 'my-4' : ''"
                    >
                        <BeatLoader size="10px" color="#a9dcff" />
                        <!-- loading... -->
                    </p>
                </li>
            </ul>

            <slot name="action"></slot>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    theme: {
        type: String,
        default: "primary",
    },
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
    icon: {
        type: String,
        default: "default",
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
        default: "client",
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
const input = ref(null);
const load = ref(null);
const observer = ref(null);
const debounce = ref(null);
const input_selection = ref(null);

const isListSelected = (item) => {
    const exist = props.hasSelected.some((v) => {
        if (typeof v == "object") {
            return v[props.optionKey] == item[props.optionKey];
        } else {
            return v == item[props.optionKey];
        }
    });

    return exist;
};

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
    if (refs.value?.input) {
        setTimeout(() => refs.value?.input?.focus(), 0);
    }
};

const closeModal = (e) => {
    if (e.key == "Escape") closeHandler();
};

const hideListMenu = (e = {}) => {
    const { target } = e;
    if (target == refs.value?.input || target == input.value) return;
    closeHandler();
};

const openHandler = () => {
    if (props.disabled) return;

    if (!bodyShow.value) {
        show_list.value = true;
        bodyShow.value = true;

        setTimeout(() => {
            focusSearchInput();
            document.addEventListener("click", hideListMenu);
            document.body.addEventListener("keydown", closeModal);
        }, 50);

        regisObserver();
    } else {
        closeHandler();
    }
};

const closeHandler = () => {
    bodyShow.value = false;
    show_list.value = false;

    document.removeEventListener("click", hideListMenu);
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
    if (isListSelected(item)) return;
    temp_value.value = props.reduce(item);
    temp_desc.value = item[props.optionLabel];
    selectHandler();
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
        const lastValue = value.value;
        value.value = temp_value.value;
        emit("selected", temp_value.value, lastValue);
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
</script>

<style lang="scss" scoped>
.input-select {
    @apply border border-solid px-3 pr-1 py-2 text-xs flex items-center cursor-pointer outline-offset-[3px] focus:outline-primaryTransparent focus:border-primaryTransparent;

    &.primary {
        @apply bg-primaryLight border-primaryLight placeholder:text-primaryDark text-primaryDark rounded-md;

        &.disabled {
            @apply bg-lightGray border-lightGray rounded-md;
        }
    }

    &.default {
        @apply border-gray bg-white rounded-xl;

        &.disabled {
            @apply bg-lightGray border-lightGray rounded-md;
        }
    }

    input {
        @apply w-full outline-none cursor-pointer p-0.5 pr-6 bg-[inherit];
    }
}

.input-error {
    border-color: red !important;
    outline-color: #ff000038 !important;
    background: #ff00000d !important;

    input {
        @apply placeholder:text-danger;
        background: none !important;
    }
}
</style>
