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
					<GoogleMap v-if="showMap" :api-key="apiMapKey" :mapId="mapId" style="width: 100%; height: 100%" :center="center" :zoom="15" @click="addMarker">
						<AdvancedMarker
							v-for="(marker, index) in markers"
							:key="index"
							:options="{
								position: marker.position,
								title: marker.title,
							}"
						/>
					</GoogleMap>
				</q-card-section>
			</q-card>
		</q-dialog>
	</q-page>
</template>

<script setup>
import { GoogleMap, AdvancedMarker } from "vue3-google-map";
import { ref, getCurrentInstance } from "vue";
const instance = getCurrentInstance();
const apiMapKey = instance.appContext.config.globalProperties.$apiMapKey;
const mapId = instance.appContext.config.globalProperties.$apiMapId;
const showMap = ref(false);
const center = { lat: 48.890079, lng: 18.036729 };

const openMap = () => {
	showMap.value = true;
};
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
