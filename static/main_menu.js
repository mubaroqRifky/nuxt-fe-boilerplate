import IconMenuDashboard from "~/components/icons/menu/IconMenuDashboard.vue";
import IconMenuUser from "~/components/icons/menu/IconMenuUser.vue";
import IconMenuRole from "~/components/icons/menu/IconMenuRole.vue";
import IconMenuPermission from "~/components/icons/menu/IconMenuPermission.vue";

export default [
    {
        caption: "",
        list: [
            {
                text: "Dashboard",
                link: "/",
                icon: shallowRef(IconMenuDashboard),
            },
        ],
    },
    {
        caption: "",
        list: [
            {
                text: "Report Title",
                child: [
                    {
                        text: "Report Child 1",
                        link: "/",
                        name: "report",
                    },
                    {
                        text: "Report Child 2",
                        link: "/",
                        name: "report",
                    },
                ],
            },
        ],
    },
];
