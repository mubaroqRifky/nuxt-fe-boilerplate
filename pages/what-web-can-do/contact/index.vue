<template>
    <MobileContainer title="Take Photo">
        <ScrollContainer>
            <ul class="flex flex-col divide-y divide-solid divide-gray">
                <template v-for="(item, index) of contacts" :key="index">
                    <li class="px-4 py-4 text-sm">
                        <p
                            v-if="item?.name?.length"
                            class="text-sm font-semibold"
                        >
                            {{ item?.name?.join(", ") }}
                        </p>

                        <p
                            v-if="item?.email?.length"
                            class="text-xs text-darkGray"
                        >
                            {{ item?.email?.join(", ") }}
                        </p>

                        <p v-if="item?.tel?.length" class="text-xs">
                            {{ item?.tel?.join(", ") }}
                        </p>

                        <p
                            v-if="item?.address?.length"
                            class="text-xs texs-darkGray"
                        >
                            {{ item?.address?.join(", ") }}
                        </p>
                    </li>
                </template>

                <div v-if="!contacts?.length">
                    <p class="text-gray text-sm">No Contact.</p>
                </div>
            </ul>
        </ScrollContainer>

        <div class="flex flex-col px-4 py-4 bg-white">
            <ButtonPrimary text="Get Contact" @press="getContactData" />
        </div>
    </MobileContainer>
</template>

<script setup>
definePageMeta({
    layout: "mobile",
    middleware: [],
});

const contacts = ref([]);

const props = [];
const opts = { multiple: true };

async function checkProperties() {
    const supportedProperties = await navigator.contacts.getProperties();
    if (supportedProperties.includes("name")) {
        props.push("name");
    }
    if (supportedProperties.includes("email")) {
        props.push("email");
    }
    if (supportedProperties.includes("tel")) {
        props.push("tel");
    }
    if (supportedProperties.includes("address")) {
        props.push("address");
    }
    if (supportedProperties.includes("icon")) {
        props.push("icon");
    }
}

// it's asynchronous as we have to wait for the contact selection
const getContactData = async () => {
    try {
        await checkProperties();
        // only execute if browser supports Contact Picker API
        if ("contacts" in navigator) {
            // indicate what contact values will be read
            const result = await navigator.contacts.select(props, opts);

            // this will execute after the native contact selector is closed
            if (result.length) {
                contacts.value = result;
            } else {
                throw new Error("No contact selected");
            }
        } else {
            throw new Error("Contact API is not supported for this browser");
        }
    } catch (error) {
        throw new ErrorHandler(error);
    }
};
</script>

<style lang="scss"></style>
