import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
    state: () => ({
        _user: null,
    }),
    getters: {
        id: (state) => {
            try {
                const app = useNuxtApp();
                const { sub } = app.$jwt.decode(state._user);
                return sub || null;
            } catch (error) {
                return null;
            }
        },
        user: (state) => {
            try {
                const app = useNuxtApp();
                const { user } = app.$jwt.decode(state._user);
                return user || null;
            } catch (error) {
                return null;
            }
        },
        customer_type: (state) => {
            try {
                const app = useNuxtApp();
                const { user } = app.$jwt.decode(state._user);
                return user?.customer_type;
            } catch (error) {
                return null;
            }
        },
        roles: (state) => {
            try {
                const app = useNuxtApp();
                const { roles } = app.$jwt.decode(state._user);
                return roles || null;
            } catch (error) {
                return null;
            }
        },
        permissions: (state) => {
            try {
                const app = useNuxtApp();
                const { permissions } = app.$jwt.decode(state._user);
                return permissions || null;
            } catch (error) {
                return null;
            }
        },
    },
    actions: {
        setUser(user = null) {
            const token = useCookie("__AUTH_TOKEN__");
            token.value = user;
            this._user = user;
        },
        removeUser() {
            const token = useCookie("__AUTH_TOKEN__");
            token.value = null;
            this._user = null;
        },
    },
});
