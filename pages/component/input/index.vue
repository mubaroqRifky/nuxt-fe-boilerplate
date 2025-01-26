<template>
    <section class="flex flex-col flex-1 gap-4">
        <section class="flex flex-col gap-4">
            <p class="text-sm font-semibold">Input Text</p>
            <div class="grid md:grid-cols-3 gap-4">
                <InputText
                    label="Input Text"
                    placeholder="Username"
                    no-validity
                />
                <InputText
                    label="Input Currency"
                    placeholder="Value"
                    type="currency"
                    v-model="form.currency"
                />
                <InputText
                    label="Input Error"
                    placeholder="Username"
                    required
                    v-model:error="error"
                />
            </div>
        </section>

        <section class="flex flex-col gap-4">
            <p class="text-sm font-semibold">Input Password</p>
            <div class="grid md:grid-cols-3 gap-4">
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

        <section class="flex flex-col gap-4">
            <p class="text-sm font-semibold">Input Checkbox</p>
            <div class="grid md:grid-cols-3 gap-4">
                <div class="flex flex-col gap-2">
                    <h3 class="text-xs font-semibold">True or False Value</h3>
                    <InputCheckbox
                        label="Is Active"
                        type="checkbox"
                        :value-true="'active'"
                        :value-false="'not_active'"
                        v-model="form.checkbox"
                    />
                    <p class="text-xs">
                        Value of checked :
                        {{ form.checkbox }}
                    </p>
                </div>

                <div class="flex flex-col gap-2">
                    <h3 class="text-xs font-semibold">Multi Checkbox</h3>
                    <div class="flex gap-2 items-center">
                        <InputCheckbox
                            label="Apple"
                            value="apple"
                            v-model="form.multicheck"
                        />
                        <InputCheckbox
                            label="Manggo"
                            value="mango"
                            v-model="form.multicheck"
                        />
                        <InputCheckbox
                            label="Jambo"
                            value="jamboo"
                            disabled
                            v-model="form.multicheck"
                        />
                    </div>
                    <p class="text-xs">
                        Value of checked :
                        {{ form.multicheck }}
                    </p>
                </div>

                <div class="flex flex-col gap-2">
                    <h3 class="text-xs font-semibold">Required Checkbox</h3>
                    <div class="flex gap-2 items-center">
                        <InputCheckbox
                            label="Check 1"
                            value="1"
                            v-model="form.checkbox_required"
                            v-model:error="error"
                        />
                        <InputCheckbox
                            label="Check 2"
                            value="0"
                            v-model="form.checkbox_required"
                            v-model:error="error"
                        />
                    </div>
                </div>
            </div>
        </section>

        <section class="flex flex-col gap-4 mt-4">
            <p class="text-sm font-semibold">Input Radio</p>
            <div class="grid md:grid-cols-3 gap-4">
                <div class="flex flex-col gap-2">
                    <h3 class="text-xs font-semibold">Is Active?</h3>
                    <div class="flex gap-2 items-center">
                        <InputRadio
                            label="Active"
                            name="input_name"
                            :value="1"
                            v-model="form.radio"
                        />
                        <InputRadio
                            label="Inactive"
                            name="input_name"
                            :value="0"
                            v-model="form.radio"
                        />
                    </div>
                    <p class="text-xs">
                        Value of checked :
                        {{ form.radio }}
                    </p>
                </div>

                <div class="flex flex-col gap-2">
                    <h3 class="text-xs font-semibold">Radio Disabled</h3>
                    <div class="flex gap-2 items-center">
                        <InputRadio
                            label="Disable Option"
                            name="input_disabled"
                            disabled
                        />
                    </div>
                </div>

                <div class="flex flex-col gap-2">
                    <h3 class="text-xs font-semibold">Input Radio Required</h3>
                    <div class="flex gap-2 items-center">
                        <InputRadio
                            label="Option 1"
                            name="radio_required"
                            :value="1"
                            v-model="form.radio_required"
                            v-model:error="error"
                        />
                        <InputRadio
                            label="Option 2"
                            name="radio_required"
                            :value="2"
                            v-model="form.radio_required"
                            v-model:error="error"
                        />
                    </div>
                </div>
            </div>
        </section>

        <section class="flex flex-col gap-4 mt-4">
            <p class="text-sm font-semibold">Input Select</p>

            <div class="grid md:grid-cols-3 gap-4">
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
                    label="Label Select Disabled"
                    placeholder="Pilihan"
                    option-label="name"
                    option-key="value"
                    disabled
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
            </div>
        </section>

        <section class="flex flex-col gap-4">
            <p class="text-sm font-semibold">Input Date</p>

            <div class="grid md:grid-cols-3 gap-4">
                <InputDate label="Date Range" placeholder="Tanggal" range />
                <InputDate
                    label="Date Disabled"
                    placeholder="Tanggal"
                    disabled
                />
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
            <div class="grid md:grid-cols-3 gap-4">
                <InputText
                    label="Textarea Required"
                    placeholder="Username"
                    type="textarea"
                    required
                    no-validity
                />
                <InputText
                    label="Textarea Disabled"
                    placeholder="Username"
                    type="textarea"
                    disabled
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
    checkbox: "not_active",
    checkbox_required: [],
    multicheck: ["mango"],
    radio: null,
    radio_required: null,
    select: null,
    currency: 1500000,
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
