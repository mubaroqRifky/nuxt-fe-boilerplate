import BaseAPI from "./BaseAPI";

export default class User extends BaseAPI {
    constructor(cookieKey?: any) {
        super(cookieKey);
    }

    async getAll(params: any) {
        this.fetcher = $fetch;
        const response = await this.get("user", params);

        if (response.error?.value) throw response.error?.value;
        return response;
    }

    async createData(payload: object) {
        this.fetcher = $fetch;
        const response = await this.post("user", payload);

        if (response.error?.value) throw response.error?.value;
        return response;
    }

    async updateData(id: any, payload: object) {
        this.fetcher = $fetch;
        const response = await this.put("user", id, payload);

        if (response.error?.value) throw response.error?.value;
        return response;
    }

    async showData(id: any) {
        this.fetcher = $fetch;
        const response = await this.get("user/" + id);

        if (response.error?.value) throw response.error?.value;
        return response;
    }

    async syncRole(payload: object) {
        this.fetcher = $fetch;
        const response = await this.post("user/sync/role", payload);

        if (response.error?.value) throw response.error?.value;
        return response;
    }

    async syncPermission(payload: object) {
        this.fetcher = $fetch;
        const response = await this.post("user/sync/permission", payload);

        if (response.error?.value) throw response.error?.value;
        return response;
    }
}
