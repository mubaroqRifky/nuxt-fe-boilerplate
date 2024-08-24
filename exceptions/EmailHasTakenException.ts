import { DefaultErrorContent } from "../composables/ErrorHandler";

export default class EmailHasTakenException extends Error {
    constructor(error: any) {
        super(error);
    }

    static run(error: any = {}) {
        const { access_token, resetHistory } = useHistoryStore();

        if (access_token) {
            Modal.onconfirm = () => {
                EmailHasTakenException.signInWithGoogle(access_token);
            };
        } else {
            Modal.onconfirm = () => {
                const router = useRouter();
                router.push("/login");
            };
        }

        Modal.error(error);
        Modal.onclose = () => resetHistory();
    }

    static signInWithGoogle(access_token: string) {
        const app = useNuxtApp();
        const router = useRouter();
        const user = useUserStore();

        loadingStart();
        app.$auth
            .loginGoogle(access_token)
            .then(({ data }) => {
                user.setUser(data.token);
                router.push("/");
            })
            .catch((error) => {
                throw new ErrorHandler(error);
            })
            .finally(() => {
                loadingStop();
            });
    }
}
