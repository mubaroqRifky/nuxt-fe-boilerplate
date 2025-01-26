<template>
    <div class="flex flex-col relative">
        <div class="flex flex-col gap-1">
            <label
                tabindex="0"
                class="border border-solid border-gray px-4 pr-3 py-1 rounded-xl text-xs flex items-center gap-2 cursor-pointer bg-white"
                @keyup.space.prevent="openHandler"
                @keyup.enter.prevent="openHandler"
            >
                <div
                    tabindex="-1"
                    @click.prevent="openHandler"
                    ref="input_selection"
                    class="w-fit whitespace-nowrap"
                >
                    <p v-if="getSelectedDateDesc">
                        {{ getSelectedDateDesc }}
                    </p>
                    <span v-else class="text-darkGray inline-block">
                        {{ placeholder }}
                    </span>
                </div>

                <IconCallendar
                    width="20px"
                    height="20px"
                    class="text-darkGray"
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
                        class="bg-white absolute bottom-0 left-0 right-0 rounded-t-2xl flex flex-col"
                        :class="title ? '' : ''"
                    >
                        <div v-if="title" class="px-6 py-4 shadow-md">
                            <h2 class="font-medium text-sm">{{ title }}</h2>
                        </div>

                        <div class="flex flex-col text-sm flex-1">
                            <div class="px-4" ref="dateContainer">
                                <ul
                                    class="flex flex-col text-sm text-darkGray my-2"
                                >
                                    <li
                                        @click="selectedDate('today')"
                                        class="px-2 py-2 transition-all cursor-pointer flex items-center justify-between hover:bg-primarySoft"
                                    >
                                        Hari Ini
                                        <span>
                                            {{ getNowDaysDesc }}
                                        </span>
                                    </li>
                                    <li
                                        @click="selectedDate('yesterday')"
                                        class="px-2 py-2 transition-all cursor-pointer flex items-center justify-between hover:bg-primarySoft"
                                    >
                                        Kemarin
                                        <span>
                                            {{ getYesterdayDesc }}
                                        </span>
                                    </li>
                                    <li
                                        @click="selectedDate('last_seven_day')"
                                        class="px-2 py-2 transition-all cursor-pointer flex items-center justify-between hover:bg-primarySoft"
                                    >
                                        7 Hari yang lalu
                                        <span>
                                            {{ getLast7DaysDesc }}
                                        </span>
                                    </li>
                                    <li
                                        @click="selectedDate('last_thirty_day')"
                                        class="px-2 py-2 transition-all cursor-pointer flex items-center justify-between hover:bg-primarySoft"
                                    >
                                        30 Hari yang lalu
                                        <span>
                                            {{ getLast30MonthDesc }}
                                        </span>
                                    </li>
                                    <li
                                        @click="selectedDate('this_month')"
                                        class="px-2 py-2 transition-all cursor-pointer flex items-center justify-between hover:bg-primarySoft"
                                    >
                                        Bulan Ini
                                        <span>
                                            {{ getThisMonthDesc }}
                                        </span>
                                    </li>
                                </ul>

                                <div
                                    @click="openDatePicker"
                                    class="border-t border-solid border-gray px-0 py-3 flex justify-between items-center cursor-pointer"
                                >
                                    <p
                                        class="text-sm flex-1 font-semibold text-darkGray"
                                    >
                                        Pilih Tanggal
                                    </p>

                                    <InputDateIcon
                                        ref="inputDate"
                                        @update:model-value="inputDateHandler"
                                        v-model="value"
                                        range
                                    />
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
        default: "Pilih Tanggal",
    },
    label: {
        type: String,
        default: "",
    },
    placeholder: {
        type: String,
        default: "",
    },
});

const value = defineModel({
    type: Array,
    default: [],
});
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
const input_selection = ref(null);

defineExpose({
    input_selection,
});

const closeModal = (e) => {
    if (e.key == "Escape") closeHandler();
};

const openHandler = () => {
    show_list.value = true;
    setTimeout(() => {
        bodyShow.value = true;
    }, 0);

    document.body.addEventListener("keydown", closeModal);
};
const closeHandler = () => {
    bodyShow.value = false;
    setTimeout(() => {
        show_list.value = false;
    }, 250);

    document.body.removeEventListener("keydown", closeModal);
};

const resetHandler = () => {
    value.value = null;
    selected_date.value = null;

    emit("selected", null);
    emit("update:modelValue", null);
    closeHandler();
};

const getDateMonthLocale = (date) => {
    const localeDate = date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
    });

    return localeDate;
};

const getDateLocale = (date) => {
    if (!date) return;
    const localeDate = date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    return localeDate;
};

const getThisMonthDesc = computed(() => {
    const { from, to } = getThisMonth();
    const fromDate = getDateMonthLocale(from);
    const toDate = getDateLocale(to);

    return `${fromDate} - ${toDate}`;
});

const getLast30MonthDesc = computed(() => {
    const { from, to } = getLast30Days();
    const fromDate = getDateMonthLocale(from);
    const toDate = getDateLocale(to);

    return `${fromDate} - ${toDate}`;
});

const getLast7DaysDesc = computed(() => {
    const { from, to } = getLast7Days();
    const fromDate = getDateMonthLocale(from);
    const toDate = getDateLocale(to);

    return `${fromDate} - ${toDate}`;
});

const getYesterdayDesc = computed(() => {
    const result = getPreviousDays();
    const previousDay = getDateLocale(result);

    return `${previousDay}`;
});

const getNowDaysDesc = computed(() => {
    const result = new Date();
    const nowDays = getDateLocale(result);

    return `${nowDays}`;
});

const dateContainer = ref(null);
const inputDate = ref(null);

const openDatePicker = () => {
    if (inputDate.value) {
        inputDate.value.input.toggleMenu();
    }
};

const getSelectedDateDesc = computed(() => {
    let [from, to] = value?.value || [];
    if (!from) return "";
    if (!to) to = from;
    return `${getDateLocale(from)} - ${getDateLocale(to)}`;
});

const inputDateHandler = async (date) => {
    let [from, to] = date;
    if (!to) to = from;

    await nextTick();

    selected_date.value = [from, to];
};

const selected_date = ref(null);
const selectedDate = (type) => {
    switch (type) {
        case "today":
            selected_date.value = [new Date(), new Date()];
            break;
        case "yesterday":
            selected_date.value = [getPreviousDays(), getPreviousDays()];
            break;
        case "last_seven_day":
            const { from: fromDate, to: toDate } = getLast7Days();
            selected_date.value = [fromDate, toDate];
            break;
        case "last_thirty_day":
            const { from: fromDate1, to: toDate1 } = getLast30Days();
            selected_date.value = [fromDate1, toDate1];
            break;
        case "this_month":
            const { from: fromDate2, to: toDate2 } = getThisMonth();
            selected_date.value = [fromDate2, toDate2];
            break;
        default:
            break;
    }
};

const selectHandler = () => {
    value.value = selected_date.value;
    emit("selected", selected_date.value);
    emit("update:modelValue", selected_date.value);
    closeHandler();
};
</script>

<style lang="scss" scoped></style>
