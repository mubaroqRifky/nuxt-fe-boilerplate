import IconMenuStarting from "~/components/icons/menu/IconMenuStarting.vue";

import IconMenuParent from "~/components/icons/menu/IconMenuParent.vue";
import IconMenuChild from "~/components/icons/menu/IconMenuChild.vue";

export default [
    {
        caption: "",
        list: [
            {
                text: "Getting Started",
                link: "/",
                icon: shallowRef(IconMenuStarting),
            },
        ],
    },
    {
        caption: "",
        list: [
            {
                text: "Component",
                icon: shallowRef(IconMenuParent),
                name: "component",
                child: [
                    {
                        text: "Button",
                        link: "/component/button",
                        name: "component-button",
                        icon: shallowRef(IconMenuChild),
                    },
                    {
                        text: "Table",
                        link: "/component/table",
                        name: "component-tabme",
                        icon: shallowRef(IconMenuChild),
                    },
                    {
                        text: "Input",
                        link: "/component/input",
                        name: "component-input",
                        icon: shallowRef(IconMenuChild),
                    },
                ],
            },
        ],
    },
];
