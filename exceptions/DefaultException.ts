import { DefaultErrorContent } from "../composables/ErrorHandler";

export default class DefaultException extends Error {
    constructor(error: any) {
        super(error);
    }

    static run(error: any = {}) {
        Modal.error({
            name: error.name || DefaultErrorContent.Uncaught,
            message: error.message || DefaultErrorContent.UncaughtMsg,
        });
    }
}
