export default defineNuxtRouteMiddleware((to, from) => {
    const token = useCookie("__AUTH_TOKEN__");
    const user = useUserStore();

    // get token exist from cookie
    if (token) user.setUser(token.value);

    // force guest user to login
    const isLoggedIn = !!token.value && !!user;
    if (!isLoggedIn) return navigateTo("/login");

    // abort navigation page if user doesn't have a permission
    const { meta } = to;
    if (meta.permit && !can(meta.permit)) {
        return false;
    }
});
