export default defineNuxtRouteMiddleware(() => {
    const fixedElement = document.querySelectorAll(".modal-input");
    for (let i = 0; i < fixedElement?.length; i++) {
        const el = fixedElement[i];
        if (typeof el.click == "function") el.click();
        return abortNavigation();
    }

    const { resetInputError } = useErrorStore();
    resetInputError();
});
