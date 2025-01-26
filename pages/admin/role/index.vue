<template>
    <section class="flex flex-col flex-1 gap-4 mt-2">
        <div class="flex items-center gap-4 justify-between">
            <div>
                <InputText
                    placeholder="Search..."
                    type="search"
                    no-validity
                    theme="default"
                    v-model="params.search"
                    @search="searchHandler"
                />
            </div>

            <div class="flex gap-2 items-center">
                <ButtonTertiary text="Create Role" @click="addItem">
                    <template #icon>
                        <IconPlus width="20px" height="20px" />
                    </template>
                </ButtonTertiary>
            </div>
        </div>

        <section class="flex flex-col gap-3 overflow-x-auto">
            <Table
                class="main-table"
                theme-color="#35b6ff"
                v-model:server-options="serverOptions"
                :server-items-length="item_meta.total"
                :rows-items="rowsItems"
                :headers="headers"
                :items="items"
                :loading="loadData"
                :search-field="searchField"
                :search-value="searchValue"
            >
                <template #item-action="item">
                    <div class="flex gap-2 items-center justify-start">
                        <ButtonPrimary outline @click="editItem(item)">
                            <template #icon>
                                <IconPencil width="12px" height="12px" />
                            </template>
                        </ButtonPrimary>

                        <ButtonDanger outline @click="confirmDelete(item)">
                            <template #icon>
                                <IconDelete width="12px" height="12px" />
                            </template>
                        </ButtonDanger>
                    </div>
                </template>
            </Table>
        </section>
    </section>
</template>

<script setup>
const title = ref("Master Role");

definePageMeta({
    layout: "admin",
    middleware: ["auth", "admin"],
});

const { $role } = useNuxtApp();
const router = useRouter();

const headers = ref([
    { text: "Name", value: "name" },
    { text: "Description", value: "description" },
    { text: "Actions", value: "action" },
]);
const items = ref([]);
const item_meta = ref({ total: 0 });
const rowsItems = ref([10, 25, 50, 100]);

const searchField = ref(["name"]);
const searchValue = ref("");

const serverOptions = ref({ page: 1, rowsPerPage: 10 });
const { page, rowsPerPage } = serverOptions.value;
const params = reactive({ page: page, per_page: rowsPerPage });

watch(
    serverOptions,
    (value) => {
        const { page, rowsPerPage } = value;
        params.page = page;
        params.per_page = rowsPerPage;

        getIndexPage();
    },
    { deep: true }
);

function addItem() {
    router.push(`/admin/role/create`);
}
function editItem(item) {
    router.push(`/admin/role/${item.id}/edit`);
}
function showItem(item) {
    router.push(`/admin/role/${item.id}/show`);
}
function confirmDelete(item) {
    Modal.confirm("Apakah anda yakin ingin menghapus data?");
    Modal.onconfirm = () => deleteItem(item.id);
}

const deleteItem = async (id) => {
    try {
        loadingStart();
        const { message } = await $role.deleteData(id);
        Modal.success(message);
        Modal.onclose = getIndexPage;
    } catch (error) {
        throw new ErrorHandler(error);
    } finally {
        loadingStop();
    }
};

const searchHandler = () => {
    serverOptions.value.page = 1;
    if (serverOptions.value.page == 1) getIndexPage();
};

const getIndexPage = async () => {
    try {
        loadDataStart();
        const { data, meta } = await $role.getAll(params);
        items.value = data;
        item_meta.value = meta;
    } catch (error) {
        throw new ErrorHandler(error);
    } finally {
        loadDataStop();
    }
};
getIndexPage();
</script>

<style lang=""></style>
