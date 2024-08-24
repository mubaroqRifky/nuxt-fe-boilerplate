import { defineStore } from "pinia";

export const useErrorStore = defineStore("errors", {
    state: () => {
        return {
            _errors: {},
            _message: "",
            _exception: "",
        };
    },

    getters: {
        errors: (state) => state._errors,
        message: (state) => state._message,
        exception: (state) => state._exception,
    },

    actions: {
        setInputError(errors) {
            this._errors = errors;
        },
        setMessageError(msg) {
            this._message = msg;
        },
        setExceptionError(name) {
            this._exception = name;
        },
        resetInputError() {
            this._errors = {};
        },
    },
});
