import DefaultException from "../exceptions/DefaultException";
import ResponseException from "../exceptions/ResponseException";

export const enum ExceptionEnum {
    ValidationException = "ValidationException",
    AuthenticationException = "AuthenticationException",
    AccessDeniedHttpException = "AccessDeniedHttpException",
}

export const enum DefaultErrorContent {
    Uncaught = "Error Uncaught",
    UncaughtMsg = "Something went wrong!",
    Timeout = "Session Timeout",
    TimeoutMsg = "Silahkan Login Kembali",
}

class ErrorHandlerClass {
    private _error: any = null;

    constructor(error: any) {
        Modal.onconfirm = () => {};
        this._error = error;
        this.build();
    }

    build() {
        if (this._error?.name == "FetchError") {
            ResponseException.run(this._error);
        } else if (this._error?.cause?.name == "FetchError") {
            ResponseException.run(this._error.cause);
        } else {
            DefaultException.run(this._error);
        }
    }
}

export const ErrorHandler = ErrorHandlerClass;
