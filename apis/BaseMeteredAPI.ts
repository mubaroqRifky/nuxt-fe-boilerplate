export default class BaseMeteredAPI {
    protected baseURL: any = "";
    fetcher: any = (...params: any) => {};

    constructor() {
        const app: any = useNuxtApp();

        this.fetcher = useFetch;
        this.baseURL = app.$config.public.METERED_API_URL;
        this.secretKey = app.$config.public.METERED_SECRET;
    }

    async get(path: string, params: any, baseURL = this.baseURL): Promise<any> {
        return this.fetcher(baseURL + "/" + path, {
            params: {
                ...params,
                secretKey: this.secretKey,
            },
        });
    }

    async post(
        path: string,
        body: any,
        params = {},
        baseURL = this.baseURL
    ): Promise<any> {
        return this.fetcher(baseURL + "/" + path, {
            body,
            params: {
                ...params,
                secretKey: this.secretKey,
            },
            method: "POST",
        });
    }

    async put(
        path: string,
        id: any,
        body: any,
        params = {},
        baseURL = this.baseURL
    ): Promise<any> {
        return this.fetcher(baseURL + "/" + path + "/" + id, {
            body,
            params: {
                ...params,
                secretKey: this.secretKey,
            },
            method: "PUT",
        });
    }

    async patch(
        path: string,
        id: any,
        body: any,
        params = {},
        baseURL = this.baseURL
    ): Promise<any> {
        return this.fetcher(baseURL + "/" + path + "/" + id, {
            body,
            params: {
                ...params,
                secretKey: this.secretKey,
            },
            method: "PATCH",
        });
    }

    async delete(
        path: any,
        id: any,
        params = {},
        baseURL = this.baseURL
    ): Promise<any> {
        return this.fetcher(baseURL + "/" + path + "/" + id, {
            params: {
                ...params,
                secretKey: this.secretKey,
            },
            method: "DELETE",
        });
    }
}
