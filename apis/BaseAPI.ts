export default class BaseAPI {
    protected baseURL: any = "";
    fetcher: any = (...params: any) => {};

    constructor() {
        const app: any = useNuxtApp();

        this.fetcher = useFetch;
        this.baseURL = app.$config.public.API_URL;
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
