class JwtDecode {
    static decode(token = "") {
        try {
            const [, payload = ""] = String(token).split(".");
            const result = window.atob(payload);

            return JSON.parse(result);
        } catch (error) {
            return null;
        }
    }
}

export default defineNuxtPlugin(() => {
    return {
        provide: {
            jwt: JwtDecode,
        },
    };
});
