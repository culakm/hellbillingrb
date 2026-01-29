<template>
	<GoogleMap :api-key="apiMapKey" :mapId="mapId" style="width: 100%; height: 500px" :center="center" :zoom="15" @click="addMarker">
		<AdvancedMarker :options="{ position: { lat: 48.893109, lng: 18.037712 }, title: 'Hover title' }" />
		<AdvancedMarker :options="{ position: { lat: 48.894111, lng: 18.028421 }, title: 'Hover title' }">
			<template #content>
				<div style="background: white; color: black; padding: 5px; border-radius: 5px">Custom nahradzac markeru</div>
			</template>
		</AdvancedMarker>
		<AdvancedMarker :options="markerOptions" :pin-options="pinOptions"> </AdvancedMarker>
		<AdvancedMarker
			v-for="(marker, index) in markers"
			:key="index"
			:options="{
				position: marker.position,
				title: marker.title,
			}"
		/>
	</GoogleMap>
</template>

<script setup>
import { getCurrentInstance, ref } from "vue";
import { GoogleMap, AdvancedMarker } from "vue3-google-map";

const instance = getCurrentInstance();
const apiMapKey = instance.appContext.config.globalProperties.$apiMapKey;
const mapId = instance.appContext.config.globalProperties.$apiMapId;
const center = { lat: 48.890079, lng: 18.036729 };

const markerOptions = { position: center, title: "LADY LIBERTY" };
const pinOptions = { background: "#FBBC04" };

const markers = ref([]);

const addMarker = (event) => {
	const latLng = event.latLng;
	markers.value.push({
		position: { lat: latLng.lat(), lng: latLng.lng() },
		title: `Marker at ${latLng.lat()}, ${latLng.lng()}`,
	});
	console.log("Markers:", markers.value);
};
</script>
