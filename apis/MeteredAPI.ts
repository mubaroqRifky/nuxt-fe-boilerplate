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

    async getRoom(room_name: any) {
        this.fetcher = $fetch;
        const response = await this.get("room/" + room_name);

        if (response.error?.value) throw response.error?.value;
        return response;
    }

    async createRoom(payload: any) {
        this.fetcher = $fetch;
        const response = await this.post("room", payload);

        if (response.error?.value) throw response.error?.value;
        return response;
    }

    async deleteRoom(room_name: any) {
        this.fetcher = $fetch;
        const response = await this.delete("room", room_name);

        if (response.error?.value) throw response.error?.value;
        return response;
    }
}
