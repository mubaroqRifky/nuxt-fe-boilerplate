import BaseAPI from "./BaseAPI";

export default class Streaming extends BaseAPI {
    constructor() {
        super();
    }

    async start(payload: object) {
        this.fetcher = $fetch;
        const response = await this.post("streaming", payload);

        if (response.error?.value) throw response.error?.value;
        return response;
    }
}
