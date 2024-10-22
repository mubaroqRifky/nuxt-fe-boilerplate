import { DefaultErrorContent } from "../composables/ErrorHandler";

export default class AccessDeniedException extends Error {
    constructor(error: any) {
        super(error);
    }

    static run(error: any = {}) {
        Modal.warning(error.message, error.name);
    }
}
