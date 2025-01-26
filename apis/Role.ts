import BaseAPI from "./BaseAPI";

export default class Role extends BaseAPI {
    constructor(cookieKey?: any) {
        super(cookieKey);
    }

    async getAll(params: any) {
        this.fetcher = $fetch;
        const response = await this.get("role", params);

        if (response.error?.value) throw response.error?.value;
        return response;
    }

    async createData(payload: object) {
        this.fetcher = $fetch;
        const response = await this.post("role", payload);

        if (response.error?.value) throw response.error?.value;
        return response;
    }

    async updateData(id: any, payload: object) {
        this.fetcher = $fetch;
        const response = await this.put("role", id, payload);

        if (response.error?.value) throw response.error?.value;
        return response;
    }

    async showData(id: any) {
        this.fetcher = $fetch;
        const response = await this.get("role/" + id);

        if (response.error?.value) throw response.error?.value;
        return response;
    }

    async deleteData(id: any) {
        this.fetcher = $fetch;
        const response = await this.delete("role", id);

        if (response.error?.value) throw response.error?.value;
        return response;
    }

    async syncPermission(payload: object) {
        this.fetcher = $fetch;
        const response = await this.post("role/sync/permission", payload);

        if (response.error?.value) throw response.error?.value;
        return response;
    }
}
