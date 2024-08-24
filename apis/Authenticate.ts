import BaseAPI from "./BaseAPI";

export default class Authenticate extends BaseAPI {
    constructor() {
        super();
    }

    async login(payload: object) {
        this.fetcher = $fetch;
        const response = await this.post("login", payload);

        if (response.error?.value) throw response.error?.value;
        return response;
    }

    async loginGoogle(access_token: string) {
        this.fetcher = $fetch;
        const response = await this.post("login/google", { access_token });

        if (response.error?.value) throw response.error?.value;
        return response;
    }

    async logout() {
        this.fetcher = $fetch;
        const response = await this.post("logout");

        if (response.error?.value) throw response.error?.value;
        return response;
    }

    async checkEmail(email: string) {
        this.fetcher = $fetch;
        const response = await this.post("email/available", { email });

        if (response.error?.value) throw response.error?.value;
        return response;
    }

    async register(payload: object) {
        this.fetcher = $fetch;
        const response = await this.post("registration", payload);

        if (response.error?.value) throw response.error?.value;
        return response;
    }

    async resendVerify() {
        this.fetcher = $fetch;
        const response = await this.post("email/verification-notification");

        if (response.error?.value) throw response.error?.value;
        return response;
    }

    async verifyEmail(id: string, token: string, params: object) {
        this.fetcher = $fetch;
        const response = await this.get(`email/verify/${id}/${token}`, params);

        if (response.error?.value) throw response.error?.value;
        return response;
    }

    async forgotPassword(email: string) {
        this.fetcher = $fetch;
        const response = await this.post("forgot-password", { email });

        if (response.error?.value) throw response.error?.value;
        return response;
    }

    async resetPassword(payload: object) {
        this.fetcher = $fetch;
        const response = await this.post("reset-password", payload);

        if (response.error?.value) throw response.error?.value;
        return response;
    }

    async profile() {
        this.fetcher = $fetch;
        const response = await this.get("profile");

        if (response.error?.value) throw response.error?.value;
        return response;
    }
}
