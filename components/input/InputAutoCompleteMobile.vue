<template>
    <div class="flex flex-col relative">
        <div class="flex flex-col gap-1">
            <span
                v-if="label"
                class="text-xs"
                :class="theme == 'primary' ? '' : 'text-primary'"
            >
                {{ label }} <i v-if="required" class="text-danger text-xs">*</i>
            </span>

            <label
                v-if="theme == 'primary'"
                class="bg-primaryLight border border-solid border-primaryLight px-5 pr-3 py-3.5 rounded-full text-sm flex items-center cursor-pointer"
                :class="[
                    disabled ? 'bg-lightGray' : 'bg-primaryLight',
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
                    class="w-full outline-none cursor-pointer"
                    :class="[disabled ? 'bg-lightGray' : 'bg-primaryLight']"
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
                        class="bg-white absolute bottom-0 left-0 right-0 flex flex-col h-full"
                    >
                        <div v-if="title" class="px-6 py-4 shadow-md">
                            <h2 class="font-semibold">{{ title }}</h2>
                        </div>
                        <div
                            class="px-4 py-4 border-b border-solid border-lightGray flex gap-4 items-center"
                            ref="input"
                        >
                            <button
                                aria-label="Button Back"
                                @click="closeHandler"
                            >
                                <IconArrowBack width="25" height="25" />
                            </button>
                            <InputText
                                size="small"
                                class="flex-1"
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
                            <div
                                v-for="(item, index) in getOptions"
                                class="px-6 py-3 text-gray-dark flex gap-2 items-center cursor-pointer group"
                                :class="
                                    index < getOptions.length - 1
                                        ? 'border-b border-solid border-white'
                                        : ''
                                "
                                @click.prevent.stop="itemSelectedHandler(item)"
                            >
                                <IconClock width="20px" height="20px" />
                                <span class="flex-1">
                                    {{ item[optionLabel] }}
                                </span>
                            </div>

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
                                    :class="!getOptions.length ? 'mt-4' : ''"
                                >
                                    <BeatLoader color="#a9dcff" />
                                </div>
                            </div>
                        </div>
                        <div
                            v-if="!isMatchAny() && searchValue && canAdd"
                            class="flex flex-col p-2"
                        >
                            <button
                                class="text-sm bg-primary text-white px-4 py-2"
                                @click.prevent.stop="addItemHandler"
                            >
                                Tambah Data
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
    canAdd: {
        type: Boolean,
        default: true,
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
    closeAfterAdd: {
        type: Boolean,
        default: true,
    },
    mode: {
        type: String,
        default: "server",
    },
});

const value = defineModel();
const searchValue = ref(null);
const emit = defineEmits([
    "update:error",
    "close",
    "selected",
    "delete",
    "add",
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

watch(
    () => value,
    (newValue) => {
        emit("update:error");
        temp_value.value = newValue.value;
    },
    { deep: true }
);

const isMatchAny = () => {
    for (const val of getOptions.value) {
        const search = String(searchValue.value).toLowerCase();
        const itemSearch = String(val[props.optionLabel]).toLowerCase();
        if (search == itemSearch) return true;
    }
    return false;
};

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

                return result ? result[optionLabel] : value.value || "";
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

const temp_value = ref(value.value);
const itemSelectedHandler = (item) => {
    temp_value.value = props.reduce(item);
    selectHandler();
};

const deleteItemHandler = (item) => {
    emit("delete", item);
};

const addItemHandler = () => {
    emit("add", searchValue.value);
    if (props.closeAfterAdd) closeHandler();
};

const resetHandler = () => {
    selected.value = null;
    temp_value.value = null;
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
    clearTimeout(debounce.value);
    debounce.value = setTimeout(() => {
        if (props.mode == "client") searchClient(searchValue.value);
        emit("search", searchValue.value);
    }, 300);
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

defineExpose({
    input_selection,
    closeHandler,
});
</script>

<style lang="scss" scoped>
.input-error {
    border-color: red !important;
    outline-color: #ff000038 !important;
    background: #ff00000d !important;
}
</style>
