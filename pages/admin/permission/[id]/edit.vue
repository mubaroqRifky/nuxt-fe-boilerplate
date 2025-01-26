<template>
    <section>
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
    </section>
</template>

<script setup>
const title = ref("Edit Permission");

definePageMeta({
    layout: "admin",
    middleware: ["auth", "admin"],
});

const { $permission } = useNuxtApp();
const router = useRouter();
const route = useRoute();
const { id } = route.params;

const form = ref({
    name: "",
    description: "",
});

function confirmUpdate() {
    Modal.confirm("Yakin ingin menyimpan data?");
    Modal.onconfirm = updateData;
}
async function updateData() {
    try {
        loadingStart();
        const { message } = await $permission.updateData(id, form.value);

        Modal.success(message);
        Modal.onclose = () => router.replace("/admin/permission");
    } catch (error) {
        throw new ErrorHandler(error);
    } finally {
        loadingStop();
    }
}

const getDetail = async (id) => {
    try {
        loadDataStart();
        const { data } = await $permission.showData(id);
        form.value.name = data.name;
        form.value.description = data.description;
    } catch (error) {
        Modal.onclose = () => router.push("/admin/permission");
        throw new ErrorHandler(error);
    } finally {
        loadDataStop();
    }
};

getDetail(id);
</script>

<style lang=""></style>
