<template>
    <MobileContainer title="Device Orientation">
        <ScrollContainer>
            <div class="garden" ref="garden">
                <div class="ball" ref="ball"></div>
            </div>
            Hold the device parallel to the ground. Rotate along its x and y
            axes to see the ball move up/down and left/right respectively.
            <pre class="output" ref="output"></pre>
        </ScrollContainer>
    </MobileContainer>
</template>

<script setup>
definePageMeta({
    layout: "mobile",
    middleware: [],
});

const ball = ref(null);
const garden = ref(null);
const output = ref(null);

const maxX = computed(() => {
    return garden.value.clientWidth - ball.value.clientWidth;
});

const maxY = computed(() => {
    return garden.value.clientHeight - ball.value.clientHeight;
});

const handleOrientation = (event) => {
    const absolute = event.absolute;
    const alpha = event.alpha;
    const beta = event.beta;
    const gamma = event.gamma;

    // Do stuff with the new orientation data
    let x = event.beta; // In degree in the range [-180,180)
    let y = event.gamma; // In degree in the range [-90,90)

    output.value.textContent = `beta: ${x}\n`;
    output.value.textContent += `gamma: ${y}\n`;

    // Because we don't want to have the device upside down
    // We constrain the x value to the range [-90,90]
    if (x > 90) {
        x = 90;
    }
    if (x < -90) {
        x = -90;
    }

    // To make computation easier we shift the range of
    // x and y to [0,180]
    x += 90;
    y += 90;

    // 10 is half the size of the ball
    // It centers the positioning point to the center of the ball
    ball.value.style.left = `${(maxY * y) / 180 - 10}px`; // rotating device around the y axis moves the ball horizontally
    ball.value.style.top = `${(maxX * x) / 180 - 10}px`; // rotating device around the x axis moves the ball vertically
};

onMounted(() => {
    window.addEventListener("deviceorientation", handleOrientation, true);
});
</script>

<style lang="scss" scoped>
.garden {
    position: relative;
    width: 200px;
    height: 200px;
    border: 5px solid #ccc;
    border-radius: 10px;
}

.ball {
    position: absolute;
    top: 90px;
    left: 90px;
    width: 20px;
    height: 20px;
    background: green;
    border-radius: 100%;
}
</style>
