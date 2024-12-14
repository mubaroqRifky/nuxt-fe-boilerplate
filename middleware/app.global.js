export default defineNuxtRouteMiddleware(() => {
    if (import.meta.server) return;

    // Handle back navigation stacked modal
    const fixedElement = document.querySelectorAll(".stack-modal");
    for (let i = fixedElement.length - 1; i >= 0; i--) {
        const el = fixedElement[i];
        if (typeof el.click == "function") el.click();
        return abortNavigation();
    }

    // Handle back navigation stack screen
    const stackScreen = document.querySelectorAll(".stack-screen");
    if (stackScreen.length) {
        const buttonBack = document.getElementById("button-back");
        const buttonClose = document.getElementById("button-close");

        if (buttonBack) buttonBack.click();
        if (buttonClose) buttonClose.click();

        return abortNavigation();
    }

    // reset error input
    const { resetInputError } = useErrorStore();
    resetInputError();
});
