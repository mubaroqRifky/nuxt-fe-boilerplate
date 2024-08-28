<template>
    <MobileContainer :header="false">
        <section
            class="flex-1 flex flex-col gap-2.5 px-6 py-8 h-full overflow-auto scrollbar-secondary"
        >
            <div
                class="flex flex-col gap-4 w-full flex-1 justify-center items-center"
            >
                <h1 class="font-bold text-2xl text-gray-dark uppercase">
                    Login
                </h1>

                <div class="flex flex-col gap-6 w-full">
                    <div class="mb-6 flex flex-col gap-3">
                        <InputText
                            theme="default"
                            placeholder="Enter Your Email"
                            v-model="form.email"
                            v-model:error="errors.email"
                        />
                        <InputPassword
                            theme="default"
                            placeholder="Password"
                            v-model="form.password"
                            v-model:error="errors.password"
                            @keyup.enter="handleLogin"
                        />
                    </div>

                    <div class="flex flex-col">
                        <ButtonMain text="Masuk" @press="handleLogin" />
                    </div>

                    <p class="text-xs text-center leading-4 -mb-2 font-medium">
                        atau masuk dengan
                    </p>

                    <div class="text-black flex justify-center">
                        <button
                            class="google-btn whitespace-nowrap max-w-xs"
                            alt="Sign In"
                            @click="googleLoginHandler"
                        >
                            <IconGoogle width="30px" height="30px" />
                        </button>

                        <ButtonGoogle
                            ref="btnGoogle"
                            class="hidden"
                            :params="params"
                            :renderParams="renderParams"
                            :success="onsuccess"
                        />
                    </div>
                </div>
            </div>
        </section>
    </MobileContainer>
</template>

<script setup>
const title = ref("Login e-Shrimp");

definePageMeta({
    layout: "mobile",
    middleware: ["guest"],
});

const { $auth, $config } = useNuxtApp();
const router = useRouter();

const user = useUserStore();

const btnGoogle = ref(null);
const form = reactive({ email: "" || "", password: "" });
const params = ref({ client_id: $config.public.GOOGLE_OAUTH_CLIENT_ID });
const renderParams = ref({ width: 250, height: 50, longtitle: true });

const googleLoginHandler = () => {
    try {
        const btn = btnGoogle.value.btn;
        if (btn) btn.click();
        else throw new Error("Hey Login Google Belum Siap!");
    } catch (error) {
        throw new ErrorHandler(error);
    }
};

const onsuccess = async (response) => {
    try {
        loadingStart();
        const id_token = response.credential;
        const { data } = await $auth.loginGoogle(id_token);
        signInUser(data.token);
    } catch (error) {
        throw new ErrorHandler(error);
    } finally {
        loadingStop();
    }
};

const handleLogin = async () => {
    try {
        loadingStart();
        const { data } = await $auth.login(form);
        signInUser(data.token);
    } catch (error) {
        throw new ErrorHandler(error);
    } finally {
        loadingStop();
    }
};

const signInUser = (token) => {
    user.setUser(token);
    router.push("/");
};
</script>

<style scoped>
.google-btn {
    @apply w-16 h-16 rounded-full outline-none shadow-xl flex gap-2 items-center justify-center justify-items-center hover:shadow-md transition-all bg-white;
}

.shadow-primary {
    box-shadow: 1px 2px 10px -4px gray;
}
</style>
