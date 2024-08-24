<template>
    <footer
        v-if="$route.meta.bottomNavigation"
        class="flex gap-2 justify-around px-2 py-2 mobile-width-constraint fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-[11]"
        style="box-shadow: -5px -5px 20px -10px gray"
    >
        <template v-for="(item, index) in menu" :key="index">
            <nuxt-link
                :to="item.link"
                class="flex flex-col gap-1 items-center justify-center transition-all outline-none"
                :class="
                    $route.name == item.name ? 'text-primary' : 'text-darkGray'
                "
            >
                <component :is="item.icon" width="25px" height="25px" />
                <p class="text-[.6rem]">
                    {{ item.text }}
                </p>
            </nuxt-link>
        </template>
    </footer>
</template>

<script setup>
import menu from "~/static/menu";
</script>

<style lang=""></style>
