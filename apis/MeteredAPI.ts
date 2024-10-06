import BaseMeteredAPI from "./BaseMeteredAPI";

export default class MeteredAPI extends BaseMeteredAPI {
    constructor() {
        super();
    }

    async getAllRoom(params: any) {
        this.fetcher = $fetch;
        const response = await this.get("rooms");

        if (response.error?.value) throw response.error?.value;
        return response;
    }
}
