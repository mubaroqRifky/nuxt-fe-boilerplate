import BaseAPI from "./BaseAPI";

export default class User extends BaseAPI {
    constructor() {
        super();
    }

    async getAll(params: any) {
        this.fetcher = $fetch;
        const response = await this.get("user", params);

        if (response.error?.value) throw response.error?.value;
        return response;
    }

    async getRoomChat(params: any) {
        this.fetcher = $fetch;
        const response = await this.get("user/rooms", params);

        if (response.error?.value) throw response.error?.value;
        return response;
    }
}
