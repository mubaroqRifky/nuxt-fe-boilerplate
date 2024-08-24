import { defineStore } from "pinia";

export const useLangStore = defineStore("lang", {
    state: () => ({ _lang: "id" }),
    getters: {
        lang: (state) => state._lang,
    },
    actions: {
        setLang(name) {
            this._lang = name || "id";
        },
    },
});
