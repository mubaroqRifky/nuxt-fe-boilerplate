export default class EmailHasNotVerifiedException extends Error {
    constructor(error: any) {
        super(error);
    }

    static run(error: any = {}) {
        const { setMessageError } = useErrorStore();
        setMessageError(error.message);

        const router = useRouter();
        router.replace("/verify-email");
    }
}
