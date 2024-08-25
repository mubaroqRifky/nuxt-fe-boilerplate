export default defineNuxtRouteMiddleware((to, from) => {
    const token = useCookie("__AUTH_TOKEN__");
    const user = useUserStore();

    if (token) user.setUser(token.value);

    const isLoggedIn = !!token.value && !!user;
    if (!isLoggedIn) return navigateTo("/login");
});
