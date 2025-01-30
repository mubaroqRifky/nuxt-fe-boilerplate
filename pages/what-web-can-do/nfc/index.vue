<template>
    <MobileContainer title="Scan NFC">
        <ScrollContainer>
            <ClientOnly>
                <section
                    class="flex flex-col gap-8 justify-center items-center flex-1"
                >
                    <h2
                        v-if="!data"
                        class="text-xl font-bold text-gray text-center"
                        :class="[scanning ? 'text-primaryLight' : '']"
                    >
                        Tap your NFC card
                    </h2>

                    <div
                        v-if="!data"
                        class="text-gray"
                        :class="[scanning ? 'text-primaryLight' : '']"
                    >
                        <IconTapNFC width="200px" />
                    </div>

                    <div v-if="data">
                        <p
                            class="text-xs"
                            v-for="(item, key) in data"
                            :key="key"
                        >
                            {{ `${key} - ${item}` }}

                            {{ JSON.stringify(data) }}
                        </p>
                    </div>
                </section>
            </ClientOnly>

            <ButtonPrimary text="Scan" @press="scanNFCHandler" />
        </ScrollContainer>
    </MobileContainer>
</template>

<script setup>
definePageMeta({
    layout: "mobile",
    middleware: [],
});

const scanning = ref(false);
const data = ref(null);

const scanNFCHandler = async () => {
    try {
        if ("NDEFReader" in window) {
            scanning.value = true;

            const ndef = new NDEFReader();

            ndef.addEventListener("readingerror", () => {
                throw new Error(
                    "Argh! Cannot read data from the NFC tag. Try another one?"
                );
            });

            ndef.addEventListener("reading", (result) => {
                const { message, serialNumber } = result;
                data.value = result;
            });

            await ndef.scan();
        } else {
            throw new Error("NFC Reader is not available!");
        }
    } catch (error) {
        throw new ErrorHandler(error);
    } finally {
        scanning.value = false;
    }
};

onMounted(() => {});
</script>

<style lang="scss"></style>
