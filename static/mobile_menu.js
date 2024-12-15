import IconDefault from "~/components/icons/menu/IconDefault.vue";

export default [
    {
        text: "Page One",
        link: "/",
        name: "index",
        icon: shallowRef(IconDefault),
    },
    {
        text: "Page Two",
        link: "/page-two",
        name: "page-two",
        icon: shallowRef(IconDefault),
    },
];
