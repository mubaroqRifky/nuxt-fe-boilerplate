export default class BaseAPI {
    protected baseURL: any = "";
    fetcher: any = (...params: any) => {};

    constructor() {
        let defaultURL = "";

        const app: any = useNuxtApp();

        if (globalThis.window) {
            const { protocol, hostname } = window?.location || {};
            defaultURL = protocol + "//" + hostname;
        }

        this.fetcher = useFetch;
        this.baseURL = app.$config.public.API_URL || defaultURL;

        if (app.$config.public.API_PORT) {
            this.baseURL += ":";
            this.baseURL += app.$config.public.API_PORT;
        }

        if (app.$config.public.API_PATH) {
            this.baseURL += app.$config.public.API_PATH;
        }
    }

    async get(path: string, params: any, baseURL = this.baseURL): Promise<any> {
        const token = useCookie("__AUTH_TOKEN__");
        const { lang } = useLangStore();

        return this.fetcher(baseURL + "/" + path, {
            params,
            headers: {
                Authorization: `Bearer ${token.value}`,
                "X-Lang": lang,
            },
        });
    }

    async post(
        path: string,
        body: any,
        params = {},
        baseURL = this.baseURL
    ): Promise<any> {
        const token = useCookie("__AUTH_TOKEN__");
        const { lang } = useLangStore();

        return this.fetcher(baseURL + "/" + path, {
            body,
            params,
            method: "POST",
            headers: {
                Authorization: `Bearer ${token.value}`,
                "X-Lang": lang,
            },
        });
    }

    async put(
        path: string,
        id: any,
        body: any,
        params = {},
        baseURL = this.baseURL
    ): Promise<any> {
        const token = useCookie("__AUTH_TOKEN__");
        const { lang } = useLangStore();

        return this.fetcher(baseURL + "/" + path + "/" + id, {
            body,
            params,
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token.value}`,
                "X-Lang": lang,
            },
        });
    }

    async delete(
        path: any,
        id: any,
        params = {},
        baseURL = this.baseURL
    ): Promise<any> {
        const token = useCookie("__AUTH_TOKEN__");
        const { lang } = useLangStore();

        return this.fetcher(baseURL + "/" + path + "/" + id, {
            params,
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token.value}`,
                "X-Lang": lang,
            },
        });
    }
}
