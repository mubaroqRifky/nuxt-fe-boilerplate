<template>
    <MobileContainer title="Location">
        <section
            class="relative px-6 pt-6 pb-6 overflow-auto scroll-hidden flex-1 flex flex-col gap-10"
        >
            <div
                class="flex-1 min-h-52 max-h-full bg-softGray flex justify-center items-center"
            >
                <ClientOnly>
                    <div id="map" class="h-full w-full"></div>
                </ClientOnly>
            </div>

            <div class="flex flex-col gap-4">
                <ButtonPrimary
                    text="Get Location"
                    @press="getLocationPermission"
                >
                    <template #icon>
                        <IconLocation width="20px" height="20px" />
                    </template>
                </ButtonPrimary>
            </div>
        </section>
    </MobileContainer>
</template>

<script setup>
definePageMeta({
    layout: "mobile",
    middleware: [],
});

const initMap = async () => {
    if (!google) return;

    const userLocation = null;

    const { Map } = await google.maps.importLibrary("maps");

    const defaultLatLng = { lat: -6.2280086, lng: 106.8063153 };

    const map = new Map(document.getElementById("map"), {
        center: userLocation || defaultLatLng,
        zoom: 14,
        mapId: "642f9a35298302f6",
        // disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: true,
        fullscreenControl: true,
    });

    window.mapStore = map;

    console.log(mapStore);
};

const getCustomMarker = () => {
    var icon = {
        path: "M5 3C5 4.10457 4.10457 5 3 5C1.89543 5 1 4.10457 1 3C1 1.89543 1.89543 1 3 1C4.10457 1 5 1.89543 5 3ZM4.5 3C4.5 3.82843 3.82843 4.5 3 4.5C2.17157 4.5 1.5 3.82843 1.5 3C1.5 2.17157 2.17157 1.5 3 1.5C3.82843 1.5 4.5 2.17157 4.5 3Z",
        fillColor: "#EE632C",
        fillOpacity: 1,
        anchor: new google.maps.Point(0, 0),
        strokeWeight: 2,
        strokeColor: "white",
        strokeOpacity: 0.6,
        scale: 5,
    };

    return icon;
};

// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (let i = 0; i < window.markers?.length; i++) {
        window.markers[i].setMap(map);
    }
}

const deleteMarkers = () => {
    setMapOnAll(null);
    window.markers = [];
};

const addMarker = async (position) => {
    deleteMarkers();

    const marker = new google.maps.Marker({
        position,
        map: mapStore,
        icon: getCustomMarker(),
    });

    window.markers = [];
    window.markers.push(marker);
};

const requestPermission = (navigator) => {
    navigator.geolocation.getCurrentPosition((position) => {
        const userPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
        };
        return userPosition;
    });
};

const getLocationPermission = () => {
    navigator.permissions.query({ name: "geolocation" }).then((result) => {
        result.addEventListener("change", () => {
            if (result.state == "granted") {
                Modal.close();
                getCurrentLocation();
            }

            if (result.state == "prompt") {
                requestPermission(navigator);
            }

            if (result.state == "denied") {
                throw new ErrorHandler({
                    name: "Permission Denied",
                    message: "Enable Permission to get current location!",
                });
            }
        });

        if (result.state === "prompt") {
            requestPermission(navigator);
            throw new ErrorHandler({
                name: "Request Permission",
                message: "Please enable location!",
            });
        }

        if (result.state === "denied") {
            throw new ErrorHandler({
                name: "Permission Denied",
                message: "Enable Permission to get current location!",
            });
        }

        getCurrentLocation();
    });
};

function success(position) {
    const crd = position.coords;

    console.log("Your current position is:");
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);

    const pos = { lat: crd.latitude, lng: crd.longitude };

    window.mapStore.setCenter(pos);
    addMarker(pos);
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

const getCurrentLocation = () => {
    navigator.geolocation.watchPosition(success, error, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    });
};

onMounted(() => {
    initMap();
});
</script>

<style lang="scss"></style>
