<template>
    <section class="flex flex-col flex-1 gap-8">
        <div class="flex flex-col gap-2">
            <h2 class="text-primary text-sm">Basic Table</h2>
            <Table
                v-model:server-options="serverOptions"
                :server-items-length="item_meta.total"
                :headers="headers"
                :items="items"
                :loading="loadData"
                :search-field="searchField"
                :search-value="searchValue"
                show-index
            />
        </div>

        <div class="flex flex-col gap-2">
            <h2 class="text-primary text-sm">Primary Table</h2>
            <Table
                class="main-table"
                v-model:server-options="serverOptions"
                :server-items-length="item_meta.total"
                :headers="headers"
                :items="items"
                :loading="loadData"
                :search-field="searchField"
                :search-value="searchValue"
                show-index
            />
        </div>
    </section>
</template>

<script setup>
const headers = ref([
    { text: "Tanggal Panen", value: "date" },
    { text: "Nomor Dokumen", value: "no_document" },
    { text: "Asal Hatchery", value: "hatchery" },
    { text: "Tank Code", value: "tub_code" },
    { text: "Status", value: "status_description" },
]);
const items = ref([
    {
        date: "22/01/24",
        no_document: "DO032700001",
        hatchery: "Hatchery Situbondo",
        tub_code: "B.10.2.11",
        status: "1",
        status_description: "Terbuat",
    },
    {
        date: "22/01/24",
        no_document: "DO032700001",
        hatchery: "Hatchery Situbondo",
        tub_code: "B.10.2.11",
        status: "2",
        status_description: "Menunggu Persetujuan",
    },
    {
        date: "22/01/24",
        no_document: "DO032700001",
        hatchery: "Hatchery Situbondo",
        tub_code: "B.10.2.11",
        status: "3",
        status_description: "Ditunda",
    },
    {
        date: "22/01/24",
        no_document: "DO032700001",
        hatchery: "Hatchery Situbondo",
        tub_code: "B.10.2.11",
        status: "4",
        status_description: "Disetujui",
    },
    {
        date: "22/01/24",
        no_document: "DO032700001",
        hatchery: "Hatchery Situbondo",
        tub_code: "B.10.2.11",
        status: "5",
        status_description: "Ditolak",
    },
]);
const item_meta = ref({ total: 5 });

const searchField = ref(["name"]);
const searchValue = ref("");

const serverOptions = ref({ page: 1, rowsPerPage: 25 });
const { page, rowsPerPage } = serverOptions.value;
const params = reactive({ page: page, per_page: rowsPerPage });

watch(serverOptions, (value) => {
    const { page, rowsPerPage } = value;
    params.page = page;
    params.per_page = rowsPerPage;
});
</script>

<style lang=""></style>
