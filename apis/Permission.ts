import BaseAPI from "./BaseAPI";

export default class Permission extends BaseAPI {
    constructor(cookieKey?: any) {
        super(cookieKey);
    }

    async getAll(params: any) {
        this.fetcher = $fetch;
        const response = await this.get("permission", params);

        if (response.error?.value) throw response.error?.value;
        return response;
    }

    async createData(payload: object) {
        this.fetcher = $fetch;
        const response = await this.post("permission", payload);

        if (response.error?.value) throw response.error?.value;
        return response;
    }

    async updateData(id: any, payload: object) {
        this.fetcher = $fetch;
        const response = await this.put("permission", id, payload);

        if (response.error?.value) throw response.error?.value;
        return response;
    }

    async showData(id: any) {
        this.fetcher = $fetch;
        const response = await this.get("permission/" + id);

        if (response.error?.value) throw response.error?.value;
        return response;
    }

    async deleteData(id: any) {
        this.fetcher = $fetch;
        const response = await this.delete("permission", id);

        if (response.error?.value) throw response.error?.value;
        return response;
    }
}
