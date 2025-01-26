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
                    :disabled="loading"
                    v-model:error="errors.name"
                    v-model="form.name"
                />
                <InputText
                    size="small"
                    label="Description"
                    placeholder="Description"
                    type="textarea"
                    :disabled="loading"
                    v-model:error="errors.description"
                    v-model="form.description"
                />
            </div>

            <div class="mt-4">
                <button class="btn btn-sm btn-primary" @click="connfirmSave">
                    Simpan
                </button>
            </div>
        </section>
    </section>
</template>

<script setup>
const title = ref("Form Permission");

definePageMeta({
    layout: "admin",
    middleware: ["auth", "admin"],
});

const { $permission } = useNuxtApp();
const router = useRouter();

const form = ref({ name: "", description: "" });

function connfirmSave() {
    Modal.confirm("Yakin ingin menyimpan data?");
    Modal.onconfirm = saveData;
}
async function saveData() {
    try {
        loadingStart();
        const { message } = await $permission.createData(form.value);
        Modal.success(message);
        Modal.onclose = () => router.replace("/admin/permission");
    } catch (error) {
        throw new ErrorHandler(error);
    } finally {
        loadingStop();
    }
}
</script>

<style lang=""></style>
