<template>
    <MobileContainer title="Push Notification">
        <ScrollContainer>
            <div>
                <InputText
                    placeholder="Message"
                    type="textarea"
                    v-model="form.message"
                />
            </div>

            <ButtonPrimary text="Send" @press="sendNotificationHandler" />
        </ScrollContainer>
    </MobileContainer>
</template>

<script setup>
const {
    requestNotificationPermission,
    sendNotification,
    registerPeriodicSync,
} = useNotification();

definePageMeta({
    layout: "mobile",
    middleware: [],
});

const form = reactive({ message: "Hey Jond Doe" });

const sendNotificationHandler = () => {
    sendNotification(form.message);
    registerPeriodicSync();
};

onMounted(() => {
    requestNotificationPermission();
});
</script>

<style lang="scss"></style>
