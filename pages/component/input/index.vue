<template>
    <section class="flex flex-col flex-1 gap-4">
        <section class="flex flex-col gap-4">
            <p class="text-sm font-semibold">Input Text</p>
            <div class="flex gap-4">
                <InputText
                    label="Input Text"
                    placeholder="Username"
                    no-validity
                />
                <InputText
                    label="Input Number"
                    placeholder="Value"
                    type="number"
                    no-validity
                />
                <InputText
                    label="Input Required"
                    placeholder="Username"
                    required
                    no-validity
                />
                <InputText
                    label="Input Error"
                    placeholder="Username"
                    v-model:error="error"
                />
            </div>
        </section>

        <section class="flex flex-col gap-4">
            <p class="text-sm font-semibold">Input Password</p>
            <div class="flex gap-4">
                <InputPassword
                    label="Password"
                    placeholder="Username"
                    type="password"
                    no-validity
                />
                <InputPassword
                    label="Password Required"
                    placeholder="Username"
                    required
                    no-validity
                />
                <InputPassword
                    label="Password Error"
                    placeholder="Username"
                    v-model:error="error"
                />
            </div>
        </section>

        <div class="flex gap-8 mb-4">
            <section class="flex flex-col gap-4">
                <p class="text-sm font-semibold">Input Checkbox</p>
                <div class="flex gap-4">
                    <InputCheckbox
                        label="Active"
                        type="checkbox"
                        :value-true="1"
                        :value-false="0"
                        v-model="form.checkbox"
                    />
                    <InputCheckbox
                        label="Checkbox Required"
                        type="checkbox"
                        :value-true="1"
                        :value-false="0"
                        v-model="form.checkbox_required"
                        v-model:error="error"
                    />
                </div>
            </section>

            <section class="flex flex-col gap-4">
                <p class="text-sm font-semibold">Input Radio</p>
                <div class="flex gap-4">
                    <InputRadio
                        label="Active"
                        type="checkbox"
                        name="input_name"
                        :value="1"
                        v-model="form.radio"
                    />
                    <InputRadio
                        label="Inactive"
                        type="checkbox"
                        name="input_name"
                        :value="0"
                        v-model="form.radio"
                        v-model:error="error"
                    />
                </div>
            </section>
        </div>

        <section class="flex flex-col gap-4">
            <p class="text-sm font-semibold">Input Select</p>

            <div class="flex gap-4">
                <InputSelect
                    label="Label Select Option"
                    placeholder="Pilihan"
                    search
                    option-label="name"
                    option-key="value"
                    :reduce="(v) => v.value"
                    :options="options"
                    v-model="form.select"
                    icon="search"
                />
                <InputSelect
                    label="Label Select Option"
                    placeholder="Pilihan"
                    required
                    option-label="name"
                    option-key="value"
                    :reduce="(v) => v.value"
                    :options="options"
                    v-model="form.select"
                    v-model:error="error"
                />
                <InputDate label="Pilih Tanggal" placeholder="Tanggal" />
                <InputDate
                    label="Pilih Tanggal"
                    placeholder="Tanggal"
                    required
                    v-model:error="error"
                />
            </div>
        </section>

        <section class="flex flex-col gap-4">
            <p class="text-sm font-semibold">Input Textarea</p>
            <div class="grid grid-cols-2 w-2/3 gap-4">
                <InputText
                    label="Textarea Required"
                    placeholder="Username"
                    type="textarea"
                    required
                    no-validity
                />
                <InputText
                    label="Textarea Error"
                    placeholder="Username"
                    type="textarea"
                    v-model:error="error"
                />
            </div>
        </section>
    </section>
</template>

<script setup>
const error = ref("Input wajib diisi");

const form = reactive({
    checkbox: null,
    checkbox_required: null,
    radio: null,
    select: null,
});

const radio = ref(null);

const options = ref([
    {
        name: "Pilihan Satu",
        value: 1,
    },
    {
        name: "Pilihan Dua",
        value: 2,
    },
    {
        name: "Pilihan Tiga",
        value: 3,
    },
]);
</script>

<style lang=""></style>
