<template>
    <main class="overflow-hidden h-[100dvh] relative bg-[#eef8ff]">
        <Transition name="ghost">
            <div
                v-show="installPrompt"
                class="fixed top-5 left-1/2 right-auto lg:left-auto lg:right-5 -translate-x-[50%] lg:translate-x-0 bg-transparent px-4 py-4 shadow-xl w-full max-w-80 z-[1000] flex flex-col gap-4 rounded-sm"
            >
                <div class="flex gap-4">
                    <div class="w-12 h-12">
                        <img
                            :src="icon"
                            alt="Icon App"
                            class="w-full h-full object-contain"
                        />
                    </div>
                    <article class="flex-1">
                        <p class="text-sm mb-1 text-white">App Name</p>
                        <p
                            class="text-[.7rem] leading-3 elipsis-2 text-elipsis text-white font-light"
                        >
                            This is a short description about the app.
                        </p>
                    </article>
                </div>

                <div class="flex gap-2 justify-end">
                    <button
                        class="bg-danger text-white px-4 py-1 text-xs rounded-md flex gap-2 items-center"
                        ref="cancellButton"
                    >
                        No
                    </button>
                    <button
                        class="bg-primary text-white px-4 py-1 text-xs rounded-md flex gap-2 items-center"
                        ref="installButton"
                    >
                        Install
                    </button>
                </div>
            </div>
        </Transition>

        <NuxtLoadingIndicator />
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </main>
</template>

<style>
.page-enter-active,
.page-leave-active {
    transition: all 0.1s;
}
.page-enter-from,
.page-leave-to {
    opacity: 0;
    filter: blur(1rem);
}
</style>

<script setup>
import icon from "/images/icon.png";
const { InitialNotification } = useNotification();

let installPrompt = ref(null);
const installButton = ref(null);
const cancellButton = ref(null);
const resultOutcome = ref(null);

function disableInAppInstallPrompt() {
    installPrompt.value = null;
}

onMounted(async () => {
    InitialNotification().then(() => {
        window.addEventListener("beforeinstallprompt", (event) => {
            console.log("beforeinstallprompt");
            event.preventDefault();

            if (resultOutcome.value === null) {
                installPrompt.value = event;

                installButton.value.addEventListener("click", async () => {
                    if (!installPrompt.value) return;
                    const result = await installPrompt.value.prompt();
                    resultOutcome.value = result;
                    console.log(`Install prompt was: ${result.outcome}`);
                    disableInAppInstallPrompt();
                });

                cancellButton.value.addEventListener("click", async () => {
                    if (!installPrompt.value) return;
                    disableInAppInstallPrompt();
                });
            }
        });

        window.addEventListener("appinstalled", () => {
            console.log("appinstalled");
            disableInAppInstallPrompt();
        });
    });
});
</script>
