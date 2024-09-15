import BaseAPI from "./BaseAPI";

export default class Chat extends BaseAPI {
    constructor() {
        super();
    }

    async create(id, payload: object) {
        this.fetcher = $fetch;
        const response = await this.post("room/" + id, payload);

        if (response.error?.value) throw response.error?.value;
        return response;
    }

    async getDetail(id: any) {
        this.fetcher = $fetch;
        const response = await this.get("room/" + id);

        if (response.error?.value) throw response.error?.value;
        return response;
    }

    async join(id: any) {
        this.fetcher = $fetch;
        const response = await this.patch("room", id);

        if (response.error?.value) throw response.error?.value;
        return response;
    }
}
