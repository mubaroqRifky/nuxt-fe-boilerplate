<template>
    <section class="flex flex-col flex-1 gap-4 mt-2">
        <section
            class="flex flex-col gap-4 bg-white px-5 py-4 border border-lightGray shadow-md"
        >
            <div class="mb-2 text-primary">
                <h2 class="text-base font-semibold uppercase">
                    {{ title }}
                </h2>
            </div>

            <div class="grid gap-4 max-w-sm text-xs">
                <InputText
                    size="small"
                    label="Name"
                    placeholder="Name"
                    :disabled="true"
                    v-model:error="errors.name"
                    v-model="form.name"
                />
                <InputText
                    size="small"
                    label="Description"
                    placeholder="Description"
                    type="textarea"
                    :disabled="loadData || loading"
                    v-model:error="errors.description"
                    v-model="form.description"
                />
            </div>

            <div class="flex justify-end">
                <button class="btn btn-sm btn-primary" @click="confirmUpdate">
                    Ubah
                </button>
            </div>
        </section>

        <section
            v-if="$route.params.id"
            class="flex flex-col gap-4 bg-white px-5 py-4 border border-lightGray shadow-md"
        >
            <div class="text-primary">
                <h2 class="text-base font-semibold uppercase">Permission</h2>
            </div>

            <div class="flex justify-between gap-2 items-center">
                <diV class="flex">
                    <InputText
                        theme="default"
                        size="extra-small"
                        placeholder="Search"
                        type="search"
                        no-validity
                        v-model="searchValuePermission"
                    />
                </diV>
                <button
                    class="btn btn-sm btn-primary"
                    @click="assignPermissionHandler"
                >
                    Assign Permission
                </button>
            </div>

            <section class="flex flex-col gap-2">
                <Table
                    :server-items-length="meta_permission.total"
                    :headers="header_permission"
                    :items="item_permission"
                    :search-field="searchFieldPermission"
                    :search-value="searchValuePermission"
                    :rows-items="[10, 25, 50, 100]"
                    :rows-per-page="10"
                />
            </section>
        </section>

        <ModalForm
            v-if="modalTable"
            :content="'Assign Permission'"
            :loading="loading"
            @close="modalTable = false"
            @proses="syncHandler"
            actionClass="justify-end"
            btnClass=""
            btnCancel="Batal"
            btnConfirm="Sync"
        >
            <section class="flex flex-col">
                <div class="flex justify-end p-2">
                    <InputText
                        theme="default"
                        size="small"
                        placeholder="Search"
                        type="search"
                        no-validity
                        v-model="statePermission.searchValue"
                        @search="searchHandler"
                    />
                </div>
                <Table
                    table-class-name="main-table fixed"
                    theme-color="#004b7c"
                    v-model:server-options="statePermission.serverOptions"
                    :server-items-length="statePermission.total"
                    :headers="statePermission.headers"
                    :items="statePermission.items"
                    :rows-items="statePermission.itemShows"
                    :loading="statePermission.loading"
                    v-model:items-selected="itemsSelected"
                    fixed-checkbox
                    :checkbox-column-width="36"
                    buttons-pagination
                />
            </section>
        </ModalForm>
    </section>
</template>

<script setup>
const title = ref("Edit Role");

definePageMeta({
    layout: "admin",
    middleware: ["auth", "admin"],
});

const { $permission, $role } = useNuxtApp();
const router = useRouter();
const route = useRoute();
const { id } = route.params;

const form = ref({
    name: "",
    description: "",
});

const meta_permission = reactive({ total: 0 });
const header_permission = ref([
    { text: "Name", value: "name" },
    { text: "Description", value: "description" },
]);
const item_permission = ref([]);
const searchFieldPermission = ref(["name"]);
const searchValuePermission = ref("");

function confirmUpdate() {
    Modal.confirm("Yakin ingin menyimpan data?");
    Modal.onconfirm = updateData;
}
async function updateData() {
    try {
        loadingStart();
        const { message } = await $role.updateData(id, form.value);

        Modal.success(message);
        Modal.onclose = () => router.replace("/admin/role");
    } catch (error) {
        throw new ErrorHandler(error);
    } finally {
        loadingStop();
    }
}

const getDetail = async (id) => {
    try {
        loadDataStart();
        const { data } = await $role.showData(id);
        form.value.name = data.name;
        form.value.description = data.description;

        item_permission.value = data.permissions;
    } catch (error) {
        Modal.onclose = () => router.push("/admin/role");
        throw new ErrorHandler(error);
    } finally {
        loadDataStop();
    }
};

const getPermissionList = async (params) => {
    try {
        statePermission.loading = true;
        const { data, meta } = await $permission.getAll(params);
        statePermission.items = data;
        statePermission.total = meta.total;
    } catch (error) {
        throw new ErrorHandler(error);
    } finally {
        statePermission.loading = false;
    }
};

const modalTable = ref(false);
const assignPermissionHandler = () => {
    modalTable.value = true;
    itemsSelected.value = [...item_permission.value];
    getPermissionList({
        page: statePermission.serverOptions.page,
        per_page: statePermission.serverOptions.rowsPerPage,
        search: statePermission.searchValue,
    });
};

const itemsSelected = ref([]);
const statePermission = reactive({
    headers: [
        { text: "Name", value: "name" },
        { text: "Description", value: "description" },
    ],
    searchField: [],
    searchValue: "",
    serverOptions: { page: 1, rowsPerPage: 10 },
    total: 0,
    itemShows: [10, 25, 50, 100],
    loading: false,
    items: [],
});

watch(
    () => statePermission.serverOptions,
    (newParams) => {
        getPermissionList({
            page: newParams.page,
            per_page: newParams.rowsPerPage,
            search: statePermission.searchValue,
        });
    }
);

const searchHandler = () => {
    statePermission.serverOptions.page = 1;
    getPermissionList({
        page: statePermission.serverOptions.page,
        per_page: statePermission.serverOptions.rowsPerPage,
        search: statePermission.searchValue,
    });
};

const syncHandler = async () => {
    try {
        loadingStart();
        const permissions = itemsSelected.value.map((v) => v.name);
        const role_name = form.value.name;
        const { data, message } = await $role.syncPermission({
            role_name,
            permissions,
        });

        item_permission.value = data.permissions;
        Modal.success(message);
    } catch (error) {
        throw new ErrorHandler(error);
    } finally {
        modalTable.value = false;
        loadingStop();
    }
};

onMounted(() => {
    getDetail(id);
});
</script>

<style lang=""></style>
