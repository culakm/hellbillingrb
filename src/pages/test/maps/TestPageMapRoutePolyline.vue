<template>
	<GoogleMap ref="mapRef" :api-key="apiMapKey" :mapId="mapId" style="width: 100%; height: 500px" :center="center" :zoom="10"> </GoogleMap>
</template>

<script setup>
import { getCurrentInstance, onMounted, ref } from "vue";
import { GoogleMap } from "vue3-google-map";

const instance = getCurrentInstance();
const apiMapKey = instance.appContext.config.globalProperties.$apiMapKey;
const mapId = instance.appContext.config.globalProperties.$apiMapId;
const center = { lat: 48.890079, lng: 18.036729 };
const mapRef = ref(null);
onMounted(() => {
	console.log("TestPageMapRoute mounted");
	// Fetch from your backend endpoint using Routes API
	fetch("/api/routes?origin=48.889444,18.036234&destination=49.81821975302162,24.01924069946072")
		.then((res) => res.json())
		.then(({ polyline }) => {
			const route = mapRef.value.api.geometry.encoding.decodePath(polyline);
			new mapRef.value.api.Polyline({
				path: route,
				strokeColor: "#FF0000",
				strokeOpacity: 1.0,
				strokeWeight: 2,
				map: mapRef.value.map,
			});
		});
});
</script>
