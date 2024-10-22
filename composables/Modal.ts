enum ModalTypeEnum {
    SUCCESS = "success",
    ERROR = "error",
    WARNING = "warning",
    CONFIRM = "confirm",
    LOGOUT = "logout",
}

enum ModalTitleEnum {
    SUCCESS = "Success",
    ERROR = "Error",
    WARNING = "Warning",
    CONFIRM = "Confirmation",
    LOGOUT = "Sign Out",
}

type ModalType = {
    show: boolean;
    type: ModalTypeEnum;
    content: string;
    subcontent: string;
    action?: boolean;
};

const useModal = () => {
    return useState("modal", (): ModalType => {
        return {
            show: false,
            type: ModalTypeEnum.SUCCESS,
            content: ModalTitleEnum.SUCCESS,
            subcontent: "",
        };
    });
};

class ModalClass {
    private static timeout: any = null;

    /**
     * Base control of modal state
     * @param type - type of modal
     * @param msg - messages
     * @param title - title of modal
     */
    private static assign(
        type: ModalTypeEnum,
        msg: string,
        title: string
    ): void {
        clearTimeout(ModalClass.timeout);

        const modal: ModalType = ModalClass.getModal;
        modal.show = true;
        modal.type = type;
        modal.content = title;
        modal.subcontent = msg;
    }

    /**
     * Get state of modal
     * @returns modal state hooks
     */
    static get getModal(): ModalType {
        const modal = useModal();
        return modal.value;
    }

    /**
     * Open succes modal
     * @param msg
     * @param content - default value will be Success
     */
    static success(msg: string, content: string = ModalTitleEnum.SUCCESS) {
        ModalClass.assign(ModalTypeEnum.SUCCESS, msg, content);
        ModalClass.timeout = setTimeout(ModalClass.close, 2000);
    }

    /**
     * Closing the modal
     * State and action will be reset after calling this method
     */
    static close(): void {
        const modal = ModalClass.getModal;
        modal.show = false;
        ModalClass.onclose();
        ModalClass.onclose = () => {};
        ModalClass.onconfirm = () => {};
    }

    /**
     * Open error modal
     * @param payload - Object value from error instance
     * it's contain name, message or content, subcontent
     */
    static error(payload: any): void {
        const { content, subcontent, name, message } = payload;
        ModalClass.assign(
            ModalTypeEnum.ERROR,
            message || subcontent,
            name || content
        );
    }

    /**
     * Open warning modal
     * @param msg
     * @param content - default value will be Warning
     */
    static warning(
        msg: string,
        content: string = ModalTitleEnum.WARNING
    ): void {
        ModalClass.assign(ModalTypeEnum.WARNING, msg, content);
    }

    /**
     * Open modal confirmation
     * @param msg
     * @param content - default value will be Confirmation
     */
    static confirm(
        msg: string,
        content: string = ModalTitleEnum.CONFIRM
    ): void {
        ModalClass.assign(ModalTypeEnum.CONFIRM, msg, content);
    }

    /**
     * Open logout modal confirmation
     * @param msg
     * @param content - default value will be Logout
     */
    static logout(msg: string, content: string = ModalTitleEnum.LOGOUT): void {
        ModalClass.assign(ModalTypeEnum.LOGOUT, msg, content);
    }

    /**
     * an action after modal confirmation clicked
     * @default value just an function with no statement
     * You can override this function and fill it with statement
     */
    static onconfirm = (): void => {};

    /**
     * an action after modal closing
     * @default value just an function with no statement
     * You can override this function and fill it with statement
     */
    static onclose = (): void => {};
}

export const Modal = ModalClass;
