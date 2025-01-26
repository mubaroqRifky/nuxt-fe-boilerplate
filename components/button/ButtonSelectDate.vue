<template>
    <section class="relative">
        <div
            @click="openSelectDate"
            class="rounded-xl border border-solid border-gray px-3 py-2.5 flex items-center bg-white min-w-56 cursor-pointer"
        >
            <p class="text-darkGray text-xs flex gap-2 items-center flex-1">
                <IconCallendar width="15px" height="15px" />

                {{ selected_date ? getSelectedDateDesc : "Pilih Tanggal" }}
            </p>
            <i
                class="text-darkGray transition-all"
                :class="show_date ? 'rotate-180' : 'rotate-0'"
            >
                <IconArrowDown width="17px" height="17px" />
            </i>
        </div>

        <Transition name="ghost">
            <div
                v-if="show_date"
                class="bg-white px-4 rounded-xl shadow-md min-w-80 min-h-52 absolute top-full mt-2 z-10"
                :class="
                    position == 'right'
                        ? 'right-0'
                        : position == 'left'
                        ? 'left-0'
                        : '-left-1/2'
                "
                ref="dateContainer"
            >
                <div
                    class="border-b border-solid border-gray px-0 py-3 flex gap-4 items-center justify-between"
                >
                    <p class="text-xs font-semibold text-darkGray">
                        Rentang Tanggal
                    </p>

                    <button
                        v-if="value && value.length"
                        class="text-[.7rem] text-danger"
                        @click="resetHandler"
                    >
                        Reset
                    </button>
                </div>

                <ul class="flex flex-col text-xs text-darkGray my-2">
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
                    <p class="text-xs flex-1 font-semibold text-darkGray">
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
        </Transition>
    </section>
</template>

<script setup>
const props = defineProps({
    position: {
        type: String,
        default: "right",
    },
});

const emit = defineEmits(["selected", "reset"]);

const value = defineModel();

const getDateMonthLocale = (date) => {
    const localeDate = date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
    });

    return localeDate;
};

const getDateLocale = (date) => {
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
const show_date = ref(false);

const openSelectDate = () => {
    show_date.value = !show_date.value;

    setTimeout(() => {
        document.addEventListener("click", clickOutsideHandler);
    }, 50);
};

const closeSelectDateHandler = () => {
    show_date.value = false;
    setTimeout(() => {
        document.removeEventListener("click", clickOutsideHandler);
    }, 50);
};

const clickOutsideHandler = (e) => {
    const { target } = e;
    if (!dateContainer.value?.contains(target)) {
        closeSelectDateHandler();
    }
};

const openDatePicker = () => {
    if (inputDate.value) {
        inputDate.value.input.toggleMenu();
    }
};

const getSelectedDateDesc = computed(() => {
    const [from, to] = selected_date.value;

    return `${getDateLocale(from)} - ${getDateLocale(to)}`;
});

const inputDateHandler = async (date) => {
    let [from, to] = date;
    if (!to) to = from;

    await nextTick();

    selected_date.value = [from, to];
    value.value = selected_date.value;

    emit("selected", selected_date.value);
    closeSelectDateHandler();
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

    value.value = selected_date.value;

    emit("selected", selected_date.value);
    closeSelectDateHandler();
};

const resetHandler = () => {
    value.value = null;
    selected_date.value = null;

    emit("reset", []);
    emit("selected", []);
    closeSelectDateHandler();
};

onBeforeUnmount(() => {
    document.removeEventListener("click", clickOutsideHandler);
});
</script>

<style lang=""></style>
