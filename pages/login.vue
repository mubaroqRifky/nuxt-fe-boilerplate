<template>
    <section class="flex flex-col flex-1 items-center justify-center bg-login">
        <div
            class="w-[90%] sm:w-[400px] flex flex-col gap-4 bg-white-blur px-6 py-6 rounded-xl shadow-sm justify-center items-center"
        >
            <div class="flex flex-col items-center justify-center py-4">
                <h1 class="font-semibold text-lg text-primaryDark">
                    Login Your Account
                </h1>
            </div>

            <div class="flex flex-col gap-6 w-full">
                <div class="flex flex-col gap-2">
                    <InputText
                        label="Email"
                        placeholder="Enter Your Email"
                        name="email"
                        v-model="form.email"
                        v-model:error="errors.email"
                    />
                    <InputPassword
                        label="Password"
                        placeholder="Password"
                        v-model="form.password"
                        v-model:error="errors.password"
                        @keyup.enter="handleLogin"
                    />
                </div>

                <div class="flex flex-col">
                    <ButtonPrimary
                        text="Login"
                        size="normal"
                        :disabled="loading"
                        @press="handleLogin"
                    />
                </div>

                <div class="flex gap-4">
                    <hr class="w-full border-gray" />
                    <p class="text-xs text-center leading-4 -my-2">or</p>
                    <hr class="w-full border-gray" />
                </div>

                <div class="text-black flex justify-center">
                    <button
                        class="google-btn"
                        :class="loading ? 'bg-gray text-white' : 'bg-white'"
                        alt="Sign In"
                        :disabled="loading"
                        @click="googleLoginHandler"
                    >
                        <IconGoogle width="20px" height="20px" />
                        Login with Google
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
</template>

<script setup>
definePageMeta({
    layout: "auth",
    middleware: ["guest"],
});

useHead({
    meta: [{ name: "color-scheme", content: "light" }],
});

const { $auth, $config } = useNuxtApp();
const router = useRouter();
const route = useRoute();

const user = useUserStore();

const error = reactive({});

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
    const { redirect_to } = route.query;

    user.setUser(token);

    if (redirect_to) router.push(redirect_to);
    else router.push("/");
};
</script>

<style scoped>
.google-btn {
    @apply w-full px-4 py-2 whitespace-nowrap text-xs font-semibold rounded-md outline-none shadow-sm border border-solid border-gray flex gap-2 items-center justify-center justify-items-center hover:shadow-md transition-all;
}

.shadow-primary {
    box-shadow: 1px 2px 10px -4px gray;
}

.bg-login {
    @apply bg-no-repeat bg-cover bg-center;
}
</style>
