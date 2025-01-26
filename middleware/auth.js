export default defineNuxtRouteMiddleware((to, from) => {
    const token = useCookie("__AUTH_TOKEN__");
    const user = useUserStore();

    // get token exist from cookie
    if (token) user.setUser(token.value);

    // force guest user to login
    const isLoggedIn = !!token.value && !!user;
    if (!isLoggedIn) {
        const { token: access_token } = to.query;

        let redirectURL = "";
        if (to.fullPath != "/") {
            const query = encodeURIComponent(to.fullPath);
            redirectURL = `?redirect_to=${query}`;
        }

        if (access_token) user.setUser(access_token);
        else return navigateTo("/login" + redirectURL);
    }

    // abort navigation page if user doesn't have a permission
    if (to.meta.permit && !can(to.meta.permit)) {
        throw createError({
            statusCode: 403,
            statusMessage:
                "Sorry, you don't have permission to access this resource",
        });
    }
});
