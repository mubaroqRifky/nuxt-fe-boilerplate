<template>
    <div class="relative">
        <ButtonPrimary text="Filter" @click="openFilterHandler">
            <template #icon>
                <IconFilter v-if="value?.length" width="15px" height="20px" />
                <IconFilterNone v-else width="15px" height="20px" />
            </template>
        </ButtonPrimary>

        <section
            v-if="show_filter"
            class="absolute top-full mt-2 right-0 flex flex-col gap-4 text-xs bg-white shadow-md p-4 rounded-lg z-10 min-w-60"
            ref="filterContainer"
        >
            <label
                v-if="type == 'checkbox'"
                class="flex items-center gap-2 pt-1"
            >
                <input
                    type="checkbox"
                    value="All"
                    v-model="value"
                    @change="selectAllFilter"
                />
                <span class="whitespace-nowrap">Semua Status</span>
            </label>

            <div v-else class="flex items-center gap-2 pt-1">
                <span class="whitespace-nowrap font-medium">Filter Status</span>
            </div>

            <hr class="border-lightGray" />

            <template v-for="(item, index) in listFilter" :key="index">
                <label class="flex items-center gap-2">
                    <input
                        :type="type"
                        :value="item[keys]"
                        :name="type == 'radio' ? 'filter' : ''"
                        v-model="value"
                        @change="selectFilterChange"
                    />
                    <span class="whitespace-nowrap">
                        {{ item[label] }}
                    </span>
                </label>
            </template>

            <div class="flex gap-2 items-center justify-end">
                <button
                    @click.self="resetFilterHandler"
                    class="text-xs bg-danger rounded-md px-4 py-1 text-white"
                >
                    Reset
                </button>
                <button
                    @click.self="applyFilterHandler"
                    class="text-xs bg-primaryDark rounded-md px-4 py-1 text-white"
                >
                    Terapkan
                </button>
            </div>
        </section>
    </div>
</template>

<script setup>
const props = defineProps({
    listFilter: {
        type: Array,
        default: function () {
            return [];
        },
    },
    keys: {
        type: String,
        default: "id",
    },
    label: {
        type: String,
        default: "text",
    },
    type: {
        type: String,
        default: "checkbox",
    },
});

const emit = defineEmits(["apply", "reset"]);

const value = defineModel({ type: [Array, String], default: [] });

const filterContainer = ref(null);
const show_filter = ref(false);

const selectAllFilter = (e) => {
    const { target } = e;

    if (target.checked) {
        value.value = props.listFilter.map((v) => v[props.keys]);
        value.value.unshift("All");
    } else {
        value.value = [];
    }
};

const selectFilterChange = (e) => {
    const { target } = e;
    if (!target.checked) {
        if (props.type == "checkbox") {
            value.value = value.value.filter((v) => v != "All");
        } else {
            value.value = target.value;
        }
    }
};

const openFilterHandler = () => {
    show_filter.value = !show_filter.value;
    document.addEventListener("click", clickOutsideHandler);
};

const closeFilterHandler = () => {
    show_filter.value = false;
    document.removeEventListener("click", clickOutsideHandler);
};

const clickOutsideHandler = (e) => {
    const { target } = e;
    if (!filterContainer.value.contains(target)) {
        closeFilterHandler();
    }
};

const applyFilterHandler = () => {
    let resultFilter = null;

    if (props.type == "checkbox") {
        resultFilter = value.value.filter((v) => v != "All");
    } else {
        resultFilter = value.value;
    }

    emit("apply", resultFilter);

    closeFilterHandler();
};

const resetFilterHandler = () => {
    if (props.type == "checkbox") {
        value.value = [];
    } else {
        value.value = null;
    }

    emit("reset");

    closeFilterHandler();
};

onBeforeUnmount(() => {
    document.removeEventListener("click", clickOutsideHandler);
});
</script>

<style lang="scss"></style>
