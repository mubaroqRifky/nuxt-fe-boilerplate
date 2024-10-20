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

export const can = (permission: any, ...args: any) => {
    const { permissions } = useUserStore();

    if (!permissions) return false;

    if (!permission) return true;

    if (args.length) {
        permission = [permission];
        permission.push(...args);
        return permission.some((val: any) => permissions.includes(val));
    }

    if (!Array.isArray(permission)) return permissions.includes(permission);

    return permission.some((val) => permissions.includes(val));
};

export const role = (role: any, ...args: any) => {
    const { roles } = useUserStore();

    if (!roles) return false;

    if (!role) return true;

    if (args.length) {
        role = [role];
        role.push(...args);
        return role.some((val: any) => roles.includes(val));
    }

    if (!Array.isArray(role)) return roles.includes(role);

    return role.some((val) => roles.includes(val));
};
