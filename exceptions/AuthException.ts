import { DefaultErrorContent } from "../composables/ErrorHandler";

export default class AuthException extends Error {
    constructor(error: any) {
        super(error);
    }

    static run(error: any = {}) {
        const user = useUserStore();
        const router = useRouter();

        Modal.error(error);
        Modal.onclose = () => {
            user.removeUser();
            router.replace("/login");
        };
    }
}
