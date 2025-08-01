<template>
    <div class="flex flex-col relative">
        <div class="flex flex-col gap-1">
            <label
                @click.prevent="openHandler"
                tabindex="0"
                class="border border-solid border-gray px-4 pr-3 py-1 rounded-xl text-xs flex items-center gap-2 cursor-pointer bg-white"
                :class="[disabled ? '' : '']"
                @keyup.space.prevent="openHandler"
                @keyup.enter.prevent="openHandler"
            >
                <div
                    tabindex="-1"
                    ref="input_selection"
                    class="w-fit whitespace-nowrap"
                    :class="[disabled ? '' : '']"
                >
                    <span v-if="!getValue" class="text-darkGray">
                        {{ placeholder }}
                    </span>
                    <p v-else>
                        {{ getValue }}
                    </p>
                </div>

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

        <Transition name="ghost">
            <section
                v-if="show_list"
                class="mobile-width-constraint fixed modal-input top-0 left-0 right-0 bottom-0 bg-transparent z-20 stack-modal"
                @click.self.stop="closeHandler"
                @keyup.escape="closeHandler"
            >
                <Transition name="slideup">
                    <div
                        v-if="bodyShow"
                        class="bg-white absolute bottom-0 left-0 right-0 rounded-t-2xl pt-2 flex flex-col"
                        :class="title ? 'min-h-[400px]' : ''"
                    >
                        <div v-if="title" class="px-6 py-4 shadow-md">
                            <h2 class="font-medium text-sm">{{ title }}</h2>
                        </div>

                        <div
                            class="flex flex-col text-sm max-h-[59vh] overflow-auto flex-1 scrollbar-secondary"
                        >
                            <label
                                v-for="(item, index) in getOptions"
                                class="px-6 py-4 flex gap-2 items-center cursor-pointer"
                                :class="
                                    index < getOptions.length - 1
                                        ? 'border-b border-solid border-softGray'
                                        : ''
                                "
                                @click.prevent="itemSelectedHandler(item)"
                            >
                                <span class="flex-1">
                                    {{ item[optionLabel] }}
                                </span>
                                <InputRadio
                                    :value="reduce(item)"
                                    :name="label + placeholder"
                                    no-validity
                                    v-model="temp_value"
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
                                    :class="!getOptions.length ? 'mt-4' : ''"
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
    search: {
        type: Boolean,
        default: false,
    },
    disabled: {
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

    if (Array.isArray(container)) {
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
};

const resetHandler = () => {
    selected.value = null;
    temp_value.value = null;
    value.value = null;
    emit("selected", null);
    emit("update:modelValue", null);
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
            if (Array.isArray(searchKey)) {
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

<style lang="scss" scoped></style>
