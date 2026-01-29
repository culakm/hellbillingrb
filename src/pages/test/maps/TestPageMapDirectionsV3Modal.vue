<template>
	<q-page class="q-pa-md bg-grey-2" style="display: flex; height: 100%">
		<q-btn label="Open map" color="primary" @click="openMap" style="height: 50px" />

		<q-dialog v-model="showMap" persistent maximized>
			<q-card class="full-height full-width">
				<q-card-section class="row items-center q-pb-none">
					<div class="text-h6">Select location</div>
					<q-space />
					<q-btn icon="close" flat round dense v-close-popup />
				</q-card-section>

				<q-card-section class="q-pa-none" style="height: calc(100vh - 56px)">
					<!-- Render map only when dialog is visible -->
					<GoogleMap v-if="showMap" ref="mapRef" :api-key="apiMapKey" :mapId="mapId" :options="mapOptions" :center="center" :zoom="13" style="width: 100%; height: 100%" />
				</q-card-section>
			</q-card>
		</q-dialog>
	</q-page>
</template>

<script setup>
// https://medium.com/@testjokerqwerty/creating-a-route-between-two-points-with-google-maps-and-vue-js-3-nuxt-js-3-3f6106fa0aa3
import { GoogleMap } from "vue3-google-map";
import { ref, reactive, computed, watch, getCurrentInstance } from "vue";
const instance = getCurrentInstance();
const apiMapKey = instance.appContext.config.globalProperties.$apiMapKey;
const mapId = instance.appContext.config.globalProperties.$apiMapId;
const showMap = ref(false);
const mapRef = ref(null);

const gmap = ref(null);
const mapOptions = reactive({
	zoom: 20,
	maxZoom: 15,
	minZoom: 3,
	styles: [],
});
const directionsRenderer = ref(null);
const center = computed(() => ({ lat: 50.4503596, lng: 30.5245025 }));

function openMap() {
	showMap.value = true;
}
watch(
	() => mapRef.value?.ready,
	(ready) => {
		if (!ready) return;
		gmap.value = mapRef.value.map;
		directions();
	},
);
function setDirection(val) {
	directionsRenderer.value = val;
}
async function directions() {
	try {
		const request = {
			origin: { lat: 48.8896, lng: 18.03091 }, // Start point
			destination: { lat: 48.850136, lng: 17.939409 }, // End point
			travelMode: "DRIVING", // Travel mode: DRIVING, WALKING, BICYCLING, TRANSIT
		};
		const directionsService = new window.google.maps.DirectionsService();
		await directionsService.route(request, (response, status) => {
			if (status === window.google.maps.DirectionsStatus.OK) {
				if (!directionsRenderer.value) {
					setDirection(new window.google.maps.DirectionsRenderer());
					directionsRenderer.value.setMap(gmap.value);
				}
				directionsRenderer.value.setDirections(response);
			} else {
				console.error("Failed to calculate the route:", status);
				alert("No route found. Please check your coordinates and travel mode.");
			}
		});
	} catch (e) {
		console.log(e);
	}
}
</script>
