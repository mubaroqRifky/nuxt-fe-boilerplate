<template>
    <section class="flex flex-col gap-3 overflow-x-auto">
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
                    v-model="form.name"
                    v-model:error="errors.name"
                />
                <InputText
                    size="small"
                    label="Email"
                    placeholder="Email"
                    :disabled="loading"
                    required
                    v-model="form.email"
                    v-model:error="errors.email"
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

            <div class="mt-4">
                <button class="btn btn-sm btn-primary" @click="connfirmSave">
                    Simpan
                </button>
            </div>
        </section>
    </section>
</template>

<script setup>
const title = ref("Form User");

definePageMeta({
    layout: "admin",
    middleware: ["auth", "admin"],
});

const { $user } = useNuxtApp();
const router = useRouter();

const form = ref({
    email: "",
    name: "",
    password: "",
});

function connfirmSave() {
    Modal.confirm("Yakin ingin menyimpan data?");
    Modal.onconfirm = saveData;
}
async function saveData() {
    try {
        loadingStart();
        const { message } = await $user.createData(form.value);
        Modal.success(message);
        Modal.onclose = () => router.replace("/admin/user");
    } catch (error) {
        throw new ErrorHandler(error);
    } finally {
        loadingStop();
    }
}
</script>

<style lang=""></style>
