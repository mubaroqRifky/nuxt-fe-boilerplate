<template>
    <section class="flex flex-col flex-1 gap-6 mt-2">
        <div>
            <div>
                <h2 class="text-primaryDark text-lg font-semibold">
                    Hai {{ user?.name }}
                </h2>
                <p class="text-darkGray text-sm">Selamat datang di CMS Admin</p>
            </div>
        </div>
    </section>
</template>

<script setup>
definePageMeta({
    layout: "admin",
    middleware: ["auth", "admin"],
});

const { user = {} } = useUserStore();
</script>

<style lang="scss"></style>
