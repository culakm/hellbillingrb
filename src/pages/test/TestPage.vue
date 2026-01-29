<template>
	<q-page class="q-pa-md">
		<q-btn label="Open movable map" color="primary" @click="dialogVis = true" />

		<!-- Simple overlay background -->
		<div v-if="dialogVis" class="fixed fullscreen" @click.self="dialogVis = false">
			<q-card class="fixed" :style="cardStyle" style="width: 80%; height: 80%; overflow: hidden">
				<q-bar class="bg-primary text-white" v-touch-pan.mouse="onPan">
					<div>Map window</div>
					<q-space />
					<q-btn dense flat icon="close" @click="dialogVis = false" />
				</q-bar>

				<q-card-section class="q-pa-none" style="height: calc(100% - 32px)">
					<GoogleMap :api-key="apiMapKey" :mapId="mapId" style="width: 100%; height: 100%" :center="center" :zoom="15" @click="addMarker">
						<AdvancedMarker
							v-for="(marker, index) in markers"
							:key="index"
							:options="{
								position: marker.position,
								title: marker.title,
							}"
							@click="removeMarker(marker)"
						/>
					</GoogleMap>
				</q-card-section>
			</q-card>
		</div>
	</q-page>
</template>

<script setup>
import { GoogleMap, AdvancedMarker } from "vue3-google-map";
import { ref, getCurrentInstance, computed } from "vue";

const instance = getCurrentInstance();
const apiMapKey = instance.appContext.config.globalProperties.$apiMapKey;
const mapId = instance.appContext.config.globalProperties.$apiMapId;
const center = { lat: 48.890079, lng: 18.036729 };

const dialogVis = ref(false);
const cardPos = ref({ x: 100, y: 100 });
const cardStyle = computed(() => ({
	left: cardPos.value.x + "px",
	top: cardPos.value.y + "px",
	transform: `translate(${cardPos.value.x}px, ${cardPos.value.y}px)`,
	"z-index": 3000,
}));

const onPan = (ev) => {
	if (ev.isFirst) {
		cardPos.value = { x: cardPos.value.x, y: cardPos.value.y };
	}
	cardPos.value = {
		x: cardPos.value.x + ev.delta.x,
		y: cardPos.value.y + ev.delta.y,
	};
};

const markers = ref([]);
const addMarker = ({ latLng }) => {
	markers.value.push({
		position: { lat: latLng.lat(), lng: latLng.lng() },
		title: `Marker at ${latLng.lat()}, ${latLng.lng()}`,
	});
	console.log("Markers:", markers.value);
};
const removeMarker = (marker) => {
	markers.value = markers.value.filter((m) => m !== marker);
};
</script>
