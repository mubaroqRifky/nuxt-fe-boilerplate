export default defineNuxtRouteMiddleware((to, from) => {
    const { roles } = useUserStore();

    if (roles) {
        // return roles.includes("ADMINISTRATOR");
    }
});
