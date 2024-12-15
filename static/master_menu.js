import IconMenuDashboard from "~/components/icons/menu/IconMenuDashboard.vue";
import IconMenuUser from "~/components/icons/menu/IconMenuUser.vue";
import IconMenuRole from "~/components/icons/menu/IconMenuRole.vue";
import IconMenuPermission from "~/components/icons/menu/IconMenuPermission.vue";

export default [
    {
        caption: "Main",
        list: [
            {
                text: "Dashboard",
                link: "/admin",
                icon: shallowRef(IconMenuDashboard),
            },
        ],
    },
    {
        caption: "Setting",
        list: [
            {
                text: "User",
                link: "/admin/user",
                icon: shallowRef(IconMenuUser),
                name: "user",
            },
            {
                text: "Role",
                link: "/admin/role",
                icon: shallowRef(IconMenuRole),
                name: "role",
            },
            {
                text: "Permission",
                link: "/admin/permission",
                icon: shallowRef(IconMenuPermission),
                name: "permission",
            },
        ],
    },
    {
        caption: "Report",
        list: [
            {
                text: "Report Title",
                child: [
                    {
                        text: "Report Child 1",
                        link: "/admin",
                        name: "report",
                    },
                    {
                        text: "Report Child 2",
                        link: "/admin",
                        name: "report",
                    },
                ],
            },
        ],
    },
];
