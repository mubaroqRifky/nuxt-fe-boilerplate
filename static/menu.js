import IconHome from "~/components/icons/menu/IconHome.vue";
import IconChat from "~/components/icons/menu/IconChat.vue";
import IconCall from "~/components/icons/menu/IconCall.vue";

export default [
    {
        text: "Home",
        link: "/",
        name: "index",
        icon: IconHome,
    },
    {
        text: "Chat",
        link: "/chat",
        name: "chat",
        icon: IconChat,
    },
    {
        text: "Calls",
        link: "/call",
        name: "call",
        icon: IconCall,
    },
];
