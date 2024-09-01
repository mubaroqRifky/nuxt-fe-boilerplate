<template>
    <main class="overflow-hidden h-[100dvh] relative bg-[#eef8ff]">
        <div
            hidden
            ref="installContainer"
            class="fixed top-0 right-0 bg-white px-4 py-3 shadow-xl max-w-72 z-[1000]"
        >
            <div class="flex gap-4 p-2">
                <div class="w-12 h-12">
                    <img
                        :src="icon"
                        alt="Icon App"
                        class="w-full h-full object-contain"
                    />
                </div>
                <article class="flex-1">
                    <p class="text-sm mb-1 text-primary font-semibold">
                        App Name
                    </p>
                    <p class="text-xs leading-3 text-elipsis text-darkGray">
                        This is a short description about the app.
                    </p>
                </article>
            </div>

            <div class="flex gap-2 justify-end">
                <button
                    class="bg-danger text-white px-2 py-1 text-xs rounded-md flex gap-2 items-center"
                    ref="cancellButton"
                >
                    No
                </button>
                <button
                    class="bg-primary text-white px-2 py-1 text-xs rounded-md flex gap-2 items-center"
                    ref="installButton"
                >
                    Install App
                </button>
            </div>
        </div>
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
const installContainer = ref(null);
const installButton = ref(null);
const cancellButton = ref(null);
const resultOutcome = ref(null);

function disableInAppInstallPrompt() {
    installPrompt.value = null;
    installContainer.value.setAttribute("hidden", "");
}

onMounted(async () => {
    InitialNotification().then(() => {
        window.addEventListener("beforeinstallprompt", (event) => {
            console.log("beforeinstallprompt");
            event.preventDefault();

            if (resultOutcome.value === null) {
                installPrompt.value = event;
                installContainer.value.removeAttribute("hidden");

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
