export default class InputException extends Error {
    constructor(error: any) {
        super(error);
    }

    static run(error: any) {
        const result = InputException.mappingError(error.data.errors);
        const { setInputError } = useErrorStore();
        setInputError(result);

        InputException.scrollFirstElementError();
        Modal.error({ ...error, name: error.data.exception });
    }

    static mappingError(errResponse: any[] = []) {
        let errors: any = {};
        for (const key in errResponse) {
            errors[key] = errResponse[key].join(", ");
        }
        return errors;
    }

    static scrollFirstElementError() {
        setTimeout(() => {
            const elErrors: any = document.querySelectorAll(".input-error");
            if (elErrors.length) {
                elErrors[0].parentElement.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                });
            }
        }, 0);
    }
}
