<template>
    <MobileContainer title="What Web Can Do">
        <ScrollContainer>
            <ul class="flex flex-col divide-y divide-solid divide-gray text-sm">
                <li class="px-4 py-4">
                    <nuxt-link to="/what-web-can-do/take-photos">
                        Take Photos
                    </nuxt-link>
                </li>
                <li class="px-4 py-4">
                    <nuxt-link to="/what-web-can-do/"> Scan QR Code </nuxt-link>
                </li>
                <li class="px-4 py-4">
                    <nuxt-link to="/what-web-can-do/location">
                        Geolocation
                    </nuxt-link>
                </li>
                <li class="px-4 py-4">
                    <nuxt-link to="/what-web-can-do/notification">
                        Push Notification
                    </nuxt-link>
                </li>
                <li class="px-4 py-4">
                    <nuxt-link to="/what-web-can-do/">
                        Device Orientation
                    </nuxt-link>
                </li>
                <li class="px-4 py-4">
                    <nuxt-link to="/what-web-can-do/contact">
                        List of Contacts
                    </nuxt-link>
                </li>
            </ul>
        </ScrollContainer>
    </MobileContainer>
</template>

<script setup>
definePageMeta({
    layout: "mobile",
    middleware: [],
});
</script>

<style lang="scss"></style>
