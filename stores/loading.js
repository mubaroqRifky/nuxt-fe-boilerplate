import { defineStore } from "pinia";

export const useLoadingStore = defineStore("loading", {
    state: () => ({ _loading: false }),
    getters: {
        loading: (state) => state._loading,
    },
    actions: {
        loadingStart() {
            this._loading = true;
        },
        loadingStop() {
            this._loading = false;
        },
    },
});

export const useLoadDataStore = defineStore("load_data", {
    state: () => ({ _loadData: false }),
    getters: {
        loadData: (state) => state._loadData,
    },
    actions: {
        loadDataStart() {
            this._loadData = true;
        },
        loadDataStop() {
            this._loadData = false;
        },
    },
});
