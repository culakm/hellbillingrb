<template>
	<!-- Simple overlay background -->
	<div class="fixed fullscreen">
		<q-card class="fixed" :style="cardStyle" style="width: 80%; height: 80%; overflow: hidden">
			<q-bar class="bg-primary text-white" v-touch-pan.mouse="onPan">
				<div>Map window</div>
				<q-space />
				<q-btn dense flat icon="save" @click="sendMarkers" />
				<q-btn dense flat icon="close" @click="closeMap" />
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
</template>

<script setup>
import { GoogleMap, AdvancedMarker } from "vue3-google-map";
import { ref, getCurrentInstance, computed, onMounted, onUnmounted } from "vue";
const loadedMarkers = defineProps({
	markers: {
		type: Array,
		default: () => [],
	},
});
const emit = defineEmits(["save-markers"]);

onMounted(() => {
	markers.value = loadedMarkers.markers || [];
	window.addEventListener("keydown", handleEscClose);
});

onUnmounted(() => {
	window.removeEventListener("keydown", handleEscClose);
});

const instance = getCurrentInstance();
const apiMapKey = instance.appContext.config.globalProperties.$apiMapKey;
const mapId = instance.appContext.config.globalProperties.$apiMapId;
const center = { lat: 48.893931, lng: 18.039421 };
const cardPos = ref({ x: 100, y: 100 });
const markers = ref([]);

const addMarker = ({ latLng }) => {
	const latOut = Number(latLng.lat().toFixed(6));
	const lngOut = Number(latLng.lng().toFixed(6));

	markers.value.push({
		position: { lat: latOut, lng: lngOut },
		title: `Marker at ${latOut}, ${lngOut}`,
	});
};

const removeMarker = (marker) => {
	markers.value = markers.value.filter((m) => m !== marker);
};

const sendMarkers = async () => {
	emit("save-markers", markers.value);
};

const closeMap = () => {
	emit("save-markers", markers.value, false);
};

const handleEscClose = (event) => {
	if (event.key === "Escape" || event.key === "Esc") {
		closeMap();
	}
};

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
</script>
