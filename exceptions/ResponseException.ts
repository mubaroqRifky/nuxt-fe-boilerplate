import { ExceptionEnum } from "../composables/ErrorHandler";
import AuthException from "./AuthException";
import AccessDeniedException from "./AccessDeniedException";
import DefaultException from "./DefaultException";
import EmailHasTakenException from "./EmailHasTakenException";
import EmailHasNotVerifiedException from "./EmailNotVerifiedException";
import InputException from "./InputException";

export default class ResponseException extends Error {
    constructor(error: any) {
        super(error);
    }

    static run(error: any) {
        try {
            const { response } = error;

            if (response && typeof response._data == "object") {
                const { data, message } = response._data;
                const exception = response._data?.exception || data?.exception;
                const objError = { name: exception, message };

                switch (exception) {
                    case ExceptionEnum.ValidationException:
                        InputException.run(response._data);
                        break;
                    case ExceptionEnum.AuthenticationException:
                        AuthException.run(objError);
                        break;
                    case ExceptionEnum.EmailNotVerifiedException:
                        EmailHasNotVerifiedException.run(objError);
                        break;
                    case ExceptionEnum.EmailHasBeenRegisteredException:
                        EmailHasTakenException.run(objError);
                        break;
                    case ExceptionEnum.AccessDeniedHttpException:
                        AccessDeniedException.run(objError);
                        break;
                    default:
                        DefaultException.run(objError);
                        break;
                }
            } else {
                DefaultException.run({
                    name: response?._data || error?.name,
                    message: response?.message || error?.message,
                });
            }
        } catch (error) {
            DefaultException.run(error);
        }
    }
}
