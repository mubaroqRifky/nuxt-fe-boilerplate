export default defineNuxtRouteMiddleware((to, from) => {
    const token = useCookie("__AUTH_TOKEN__");
    const user = useUserStore();

    // get token exist from cookie
    if (token) user.setUser(token.value);
});
