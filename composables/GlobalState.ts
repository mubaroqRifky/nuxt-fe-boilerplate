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
