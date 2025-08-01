// Loading Utils
export const loading = computed(() => useLoadingStore().loading);
export const loadingStart = () => useLoadingStore().loadingStart();
export const loadingStop = () => useLoadingStore().loadingStop();

// Load Data Utils
export const loadData = computed(() => useLoadDataStore().loadData);
export const loadDataStart = () => useLoadDataStore().loadDataStart();
export const loadDataStop = () => useLoadDataStore().loadDataStop();

export const errorMessage = computed(() => useErrorStore().message);
export const errors = computed(() => useErrorStore().errors);

export const can = (permission: any) => {
    const { permissions = [], roles = [] } = useUserStore();

    if (!roles || !permissions || !permission) return true;

    const isAdmin = roles.includes("ADMINISTRATOR");
    if (isAdmin) return true;

    if (!Array.isArray(permission)) return permissions.includes(permission);

    return permission.some((val) => permissions.includes(val));
};

export const role = (role: any) => {
    const { roles = [] } = useUserStore();

    if (!roles || !role) return true;

    const isAdmin = roles.includes("ADMINISTRATOR");
    if (isAdmin) return true;

    if (!Array.isArray(role)) return roles.includes(role);

    return role.some((val) => roles.includes(val));
};
