import BaseAPI from "./BaseAPI";

export default class Subscription extends BaseAPI {
    constructor() {
        super();
    }

    async subscribe(payload: object) {
        this.fetcher = $fetch;
        const response = await this.post("subscribe", payload);

        if (response.error?.value) throw response.error?.value;
        return response;
    }

    async broadcast(payload: object) {
        this.fetcher = $fetch;
        const response = await this.post("broadcast", payload);

        if (response.error?.value) throw response.error?.value;
        return response;
    }
}
