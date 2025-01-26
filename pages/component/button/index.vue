<template>
    <section class="flex flex-col flex-1 gap-8">
        <div class="flex flex-col gap-2">
            <span class="text-xs text-primary">Button Primary</span>

            <div class="flex gap-4">
                <div>
                    <p class="text-xs text-darkGray">Small</p>

                    <ButtonPrimary text="Approve" />
                </div>

                <div>
                    <p class="text-xs text-darkGray">Default</p>

                    <ButtonPrimary text="Approve" size="normal" outline />
                </div>

                <div>
                    <p class="text-xs text-darkGray">Small</p>

                    <ButtonPrimary text="Filter" outline>
                        <template #icon>
                            <IconFilter width="12px" height="12px" />
                        </template>
                    </ButtonPrimary>
                </div>

                <div>
                    <p class="text-xs text-darkGray">Default</p>

                    <ButtonPrimary text="Filter" size="normal">
                        <template #icon>
                            <IconFilter width="12px" height="12px" />
                        </template>
                    </ButtonPrimary>
                </div>

                <div>
                    <p class="text-xs text-darkGray">Small</p>

                    <ButtonPrimary text="Filter" disabled>
                        <template #icon>
                            <IconFilter width="12px" height="12px" />
                        </template>
                    </ButtonPrimary>
                </div>

                <div>
                    <p class="text-xs text-darkGray">Default</p>

                    <ButtonPrimary text="Filter" size="normal" disabled>
                        <template #icon>
                            <IconFilter width="12px" height="12px" />
                        </template>
                    </ButtonPrimary>
                </div>
            </div>
        </div>

        <div class="flex flex-col gap-2">
            <span class="text-xs text-primary">Button Secondary</span>

            <div class="flex gap-4">
                <div>
                    <p class="text-xs text-darkGray">Small</p>

                    <ButtonSecondary text="Upload" />
                </div>

                <div>
                    <p class="text-xs text-darkGray">Default</p>
                    <ButtonSecondary text="Upload" size="normal" outline />
                </div>

                <div>
                    <p class="text-xs text-darkGray">Small</p>

                    <ButtonSecondary text="Upload" outline>
                        <template #icon>
                            <IconUpload width="12px" height="12px" />
                        </template>
                    </ButtonSecondary>
                </div>

                <div>
                    <p class="text-xs text-darkGray">Default</p>

                    <ButtonSecondary text="Upload" size="normal">
                        <template #icon>
                            <IconUpload width="12px" height="12px" />
                        </template>
                    </ButtonSecondary>
                </div>

                <div>
                    <p class="text-xs text-darkGray">Small</p>

                    <ButtonSecondary text="Upload" disabled>
                        <template #icon>
                            <IconUpload width="12px" height="12px" />
                        </template>
                    </ButtonSecondary>
                </div>

                <div>
                    <p class="text-xs text-darkGray">Default</p>

                    <ButtonSecondary text="Upload" size="normal" disabled>
                        <template #icon>
                            <IconUpload width="12px" height="12px" />
                        </template>
                    </ButtonSecondary>
                </div>
            </div>
        </div>

        <div class="flex flex-col gap-2">
            <span class="text-xs text-primary">Button Tertiary</span>

            <div class="flex gap-4">
                <div>
                    <p class="text-xs text-darkGray">Small</p>

                    <ButtonTertiary text="Unrelease" />
                </div>

                <div>
                    <p class="text-xs text-darkGray">Default</p>

                    <ButtonTertiary text="Unrelease" size="normal" outline />
                </div>

                <div>
                    <p class="text-xs text-darkGray">Small</p>

                    <ButtonTertiary text="Buat QC" outline>
                        <template #icon>
                            <IconPlus width="15px" height="15px" />
                        </template>
                    </ButtonTertiary>
                </div>

                <div>
                    <p class="text-xs text-darkGray">Default</p>

                    <ButtonTertiary text="Buat QC" size="normal">
                        <template #icon>
                            <IconPlus width="15px" height="15px" />
                        </template>
                    </ButtonTertiary>
                </div>

                <div>
                    <p class="text-xs text-darkGray">Small</p>

                    <ButtonTertiary text="Buat QC" disabled>
                        <template #icon>
                            <IconPlus width="15px" height="15px" />
                        </template>
                    </ButtonTertiary>
                </div>

                <div>
                    <p class="text-xs text-darkGray">Default</p>

                    <ButtonTertiary text="Buat QC" size="normal" disabled>
                        <template #icon>
                            <IconPlus width="15px" height="15px" />
                        </template>
                    </ButtonTertiary>
                </div>
            </div>
        </div>

        <div class="flex flex-col gap-2">
            <span class="text-xs text-primary">Button Danger</span>

            <div class="flex gap-4">
                <div>
                    <p class="text-xs text-darkGray">Small</p>

                    <ButtonDanger text="Delete" />
                </div>

                <div>
                    <p class="text-xs text-darkGray">Default</p>

                    <ButtonDanger text="Delete" size="normal" outline />
                </div>

                <div>
                    <p class="text-xs text-darkGray">Small</p>

                    <ButtonDanger text="Delete" outline>
                        <template #icon>
                            <IconDelete width="15px" height="15px" />
                        </template>
                    </ButtonDanger>
                </div>

                <div>
                    <p class="text-xs text-darkGray">Default</p>

                    <ButtonDanger text="Delete" size="normal">
                        <template #icon>
                            <IconDelete width="15px" height="15px" />
                        </template>
                    </ButtonDanger>
                </div>

                <div>
                    <p class="text-xs text-darkGray">Small</p>

                    <ButtonDanger text="Delete" disabled>
                        <template #icon>
                            <IconDelete width="15px" height="15px" />
                        </template>
                    </ButtonDanger>
                </div>

                <div>
                    <p class="text-xs text-darkGray">Default</p>

                    <ButtonDanger text="Delete" size="normal" disabled>
                        <template #icon>
                            <IconDelete width="15px" height="15px" />
                        </template>
                    </ButtonDanger>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup></script>

<style lang=""></style>
