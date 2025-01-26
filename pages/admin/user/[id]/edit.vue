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
                    :disabled="loadData || loading"
                    v-model:error="errors.name"
                    v-model="form.name"
                />
                <InputText
                    size="small"
                    label="Email"
                    placeholder="Email"
                    :disabled="loadData || loading"
                    v-model:error="errors.email"
                    v-model="form.email"
                />
                <InputCheckbox
                    label="Active"
                    type="checkbox"
                    :disabled="loadData || loading"
                    :value-true="1"
                    :value-false="0"
                    v-model:error="errors.is_active"
                    v-model="form.is_active"
                />
                <InputPassword
                    size="small"
                    label="Password"
                    placeholder="Password"
                    :disabled="loading"
                    required
                    v-model="form.password"
                    v-model:error="errors.password"
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
            <div class="mb-2 text-primary">
                <h2 class="text-base font-semibold uppercase">Roles</h2>
            </div>

            <div class="flex justify-between gap-2 items-center">
                <diV class="flex">
                    <InputText
                        theme="default"
                        size="extra-small"
                        placeholder="Search"
                        type="search"
                        no-validity
                        v-model="searchValueRole"
                    />
                </diV>
                <button
                    class="btn btn-sm btn-primary"
                    @click="assignHandler('role')"
                >
                    Assign Role
                </button>
            </div>

            <section class="flex flex-col gap-2">
                <Table
                    :server-items-length="meta_role.total"
                    :headers="header_role"
                    :items="item_role"
                    :search-field="searchFieldRole"
                    :search-value="searchValueRole"
                    :rows-items="[10, 25, 50, 100]"
                    :rows-per-page="10"
                />
            </section>
        </section>

        <section
            v-if="$route.params.id"
            class="flex flex-col gap-4 bg-white px-5 py-4 border border-lightGray shadow-md"
        >
            <div class="mb-2 text-primary">
                <h2 class="text-base font-semibold uppercase">
                    Direct Permission
                </h2>
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
                    @click="assignHandler('permission')"
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
            :content="
                current_assign == 'role' ? 'Assign Role' : 'Assign Permission'
            "
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
                        v-model="stateModal.searchValue"
                        @search="searchHandler"
                    />
                </div>
                <Table
                    table-class-name="main-table fixed"
                    theme-color="#004b7c"
                    v-model:server-options="stateModal.serverOptions"
                    :server-items-length="stateModal.total"
                    :headers="stateModal.headers"
                    :items="stateModal.items"
                    :rows-items="stateModal.itemShows"
                    :loading="stateModal.loading"
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
const title = ref("Edit User");

definePageMeta({
    layout: "admin",
    middleware: ["auth", "admin"],
});

const { $user, $permission, $role, $customer, $plant } = useNuxtApp();
const router = useRouter();
const route = useRoute();
const { id } = route.params;

const detail = ref(null);

const form = ref({
    name: "",
    email: "",
    is_active: "",
    password: "",
});

const meta_role = reactive({ total: 0 });
const header_role = ref([
    { text: "Name", value: "name" },
    { text: "Description", value: "description" },
]);
const item_role = ref([]);
const searchFieldRole = ref(["name"]);
const searchValueRole = ref("");

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
        const { data, message } = await $user.updateData(id, form.value);
        detail.value = data;

        Modal.success(message);
        Modal.onclose = () => router.replace("/admin/user");
    } catch (error) {
        throw new ErrorHandler(error);
    } finally {
        loadingStop();
    }
}

const getDetail = async (id) => {
    try {
        loadDataStart();
        const { data } = await $user.showData(id);
        detail.value = data;

        form.value.name = data.name;
        form.value.email = data.email;
        form.value.is_active = data.is_active;

        item_role.value = data.roles;
        item_permission.value = data.permissions;
    } catch (error) {
        Modal.onclose = () => router.push("/admin/user");
        throw new ErrorHandler(error);
    } finally {
        loadDataStop();
    }
};

const getPermissionList = async (params) => {
    try {
        stateModal.loading = true;
        const { data, meta } = await $permission.getAll(params);
        stateModal.items = data;
        stateModal.total = meta.total;
    } catch (error) {
        throw new ErrorHandler(error);
    } finally {
        stateModal.loading = false;
    }
};

const getRoleList = async (params) => {
    try {
        stateModal.loading = true;
        const { data, meta } = await $role.getAll(params);
        stateModal.items = data;
        stateModal.total = meta.total;
    } catch (error) {
        throw new ErrorHandler(error);
    } finally {
        stateModal.loading = false;
    }
};

const modalTable = ref(false);
const current_assign = ref(null);

const resetStateTable = () => {
    stateModal.items = [];
    stateModal.total = 0;
    stateModal.serverOptions.page = 1;
    stateModal.searchValue = "";
    itemsSelected.value = [];
};

const assignHandler = (type) => {
    resetStateTable();

    current_assign.value = type;
    modalTable.value = true;

    let items = [];

    switch (type) {
        case "role":
            items = [...item_role.value];
            stateModal.headers = header_role.value;
            break;
        case "permission":
            items = [...item_permission.value];
            stateModal.headers = header_permission.value;
            break;
        default:
            break;
    }

    const { serverOptions, searchValue } = stateModal;

    fetchHandler(
        {
            page: serverOptions.page,
            per_page: serverOptions.rowsPerPage,
            search: searchValue,
        },
        type,
        items
    );
};

const itemsSelected = ref([]);
const stateModal = reactive({
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
    () => stateModal.serverOptions,
    (newParams) => {
        fetchHandler(
            {
                page: newParams.page,
                per_page: newParams.rowsPerPage,
                search: stateModal.searchValue,
            },
            current_assign.value
        );
    }
);

const searchHandler = () => {
    stateModal.serverOptions.page = 1;
    fetchHandler(
        {
            page: stateModal.serverOptions.page,
            per_page: stateModal.serverOptions.rowsPerPage,
            search: stateModal.searchValue,
        },
        current_assign.value
    );
};

const syncHandler = async () => {
    try {
        loadingStart();

        let method = "syncRole";
        const params = { user_id: id };

        switch (current_assign.value) {
            case "role":
                params.roles = itemsSelected.value.map((v) => v.name);
                method = "syncRole";
                break;
            case "permission":
                params.permissions = itemsSelected.value.map((v) => v.name);
                method = "syncPermission";
                break;
            default:
                break;
        }

        const { data, message } = await $user[method](params);

        switch (current_assign.value) {
            case "role":
                item_role.value = data.roles;
                break;
            case "permission":
                item_permission.value = data.permissions;
                break;
            default:
                break;
        }

        Modal.success(message);
    } catch (error) {
        throw new ErrorHandler(error);
    } finally {
        modalTable.value = false;
        loadingStop();
    }
};

const fetchHandler = (params, type, items = []) => {
    if (items.length) itemsSelected.value = [...items];

    const resultParams = {
        page: params.page,
        per_page: params.per_page,
        search: params.search,
    };

    switch (type) {
        case "role":
            getRoleList(resultParams);
            break;
        case "permission":
            getPermissionList(resultParams);
            break;
        default:
            break;
    }
};

onMounted(() => {
    getDetail(id);
});
</script>

<style lang=""></style>
