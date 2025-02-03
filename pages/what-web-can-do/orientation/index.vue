<template>
    <MobileContainer title="Device Orientation">
        <ScrollContainer class="gap-4">
            <div class="compass" ref="compassContainer">
                <div class="arrow"></div>
                <div class="compass-circle" ref="compassCircle"></div>
                <div class="my-point" ref="myPoint"></div>
            </div>
        </ScrollContainer>
    </MobileContainer>
</template>

<script setup>
definePageMeta({
    layout: "mobile",
    middleware: [],
});

const maxPointX = computed(() => {
    return compassContainer.value.clientWidth - myPoint.value.clientWidth;
});

const maxPointY = computed(() => {
    return compassContainer.value.clientHeight - myPoint.value.clientHeight;
});

const compass = ref(null);
const compassContainer = ref(null);
const compassCircle = ref(null);
const myPoint = ref(null);
const pointDegree = ref(null);

const isIOS = computed(() => {
    return !(
        navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
        navigator.userAgent.match(/AppleWebKit/)
    );
});

const locationHandler = (position) => {
    const { latitude, longitude } = position.coords;

    pointDegree.value = calcDegreeToPoint(latitude, longitude);

    if (pointDegree.value < 0) {
        pointDegree.value = pointDegree.value + 360;
    }
};

const calcDegreeToPoint = (latitude, longitude) => {
    // Qibla geolocation
    const point = {
        lat: 21.422487,
        lng: 39.826206,
    };

    const phiK = (point.lat * Math.PI) / 180.0;
    const lambdaK = (point.lng * Math.PI) / 180.0;
    const phi = (latitude * Math.PI) / 180.0;
    const lambda = (longitude * Math.PI) / 180.0;
    const psi =
        (180.0 / Math.PI) *
        Math.atan2(
            Math.sin(lambdaK - lambda),
            Math.cos(phi) * Math.tan(phiK) -
                Math.sin(phi) * Math.cos(lambdaK - lambda)
        );
    return Math.round(psi);
};

const startCompass = () => {
    window.addEventListener(
        "deviceorientationabsolute",
        handleOrientation,
        true
    );
};

const handleOrientation = (event) => {
    navigator.geolocation.getCurrentPosition(locationHandler);

    // const absolute = event.absolute;
    // const alpha = event.alpha;
    // const beta = event.beta;
    // const gamma = event.gamma;

    // Do stuff with the new orientation data
    let x = event.beta; // In degree in the range [-180,180)
    let y = event.gamma; // In degree in the range [-90,90)

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

    compass.value = event.webkitCompassHeading || Math.abs(event.alpha - 360);
    compassCircle.value.style.transform = `translate(-50%, -50%) rotate(${-compass.value}deg)`;

    // ±15 degree
    if (
        (pointDegree.value < Math.abs(compass.value) &&
            pointDegree.value + 15 > Math.abs(compass.value)) ||
        pointDegree.value > Math.abs(compass.value + 15) ||
        pointDegree.value < Math.abs(compass.value)
    ) {
        myPoint.value.style.opacity = 1;
    } else if (pointDegree.value) {
        myPoint.value.style.opacity = 1;
    }

    myPoint.value.style.left = `${(maxPointX.value * y) / 180 + 10}px`;
    myPoint.value.style.top = `${(maxPointY.value * x) / 180 + 10}px`;
};

onMounted(() => {
    startCompass();
});
</script>

<style lang="scss" scoped>
.compass {
    position: relative;
    width: 320px;
    height: 320px;
    border-radius: 50%;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    margin: auto;
}

.compass > .arrow {
    position: absolute;
    width: 0;
    height: 0;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    border-style: solid;
    border-width: 30px 20px 0 20px;
    border-color: red transparent transparent transparent;
    z-index: 1;
}

.compass > .compass-circle,
.compass > .my-point {
    position: absolute;
    width: 80%;
    height: 80%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: transform 0.1s ease-out;
    background: url("https://purepng.com/public/uploads/large/purepng.com-compasscompassinstrumentnavigationcardinal-directionspointsdiagram-1701527842316onq7x.png")
        center no-repeat;
    background-size: contain;
}

.compass > .my-point {
    opacity: 0;
    width: 20px;
    height: 20px;
    background: rgb(8, 223, 69);
    border-radius: 50%;
    transition: opacity 0.5s ease-out;
}
</style>
