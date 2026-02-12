<template>
	<q-page class="q-pa-md bg-grey-2">
		<q-card>
			<q-card-section class="row items-center justify-between">
				<trip-form v-if="activeTripReactive" @save-data="updateTripLocal" :trip="activeTripReactive" />
			</q-card-section>
			<q-separator />
			<q-card-section>
				<q-btn label="Open movable map" color="primary" @click="openMapsDialog" />
				<q-btn label="Delete all lines" color="primary" @click="deleteLinesLocal" />
				<maps-dialog v-if="dialogVis" :markers="linesStore.mapMarkers" @save-markers="markers2Lines" />
			</q-card-section>
			<q-separator />
			<q-card-section>
				<VueDraggable v-if="activeTripReactive?.lines?.length" ref="el" v-model="activeTripReactive.lines" item-key="lineId" :disabled="!draggableEnabled" :animation="150" ghostClass="ghost" @start="onStart" @end="onEnd">
					<line-actions v-for="line in activeTripReactive.lines" :key="line.lineId" :line="line" :trip-id="activeTripReactive.tripId" @line-is-edited="lineIsEdited" />
				</VueDraggable>
			</q-card-section>
			<q-separator />
			<q-card-section>
				<line-form v-if="activeTripReactive" @save-line="createLineLocal" />
			</q-card-section>
		</q-card>
	</q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

import { useAuthStore } from "@/stores/auth";
import { useTripsStore } from "@/stores/trips";
import { useLinesStore } from "@/stores/lines";
import { VueDraggable } from "vue-draggable-plus";
import TripForm from "@/components/trips/TripForm.vue";
import LineForm from "@/components/lines/LineForm.vue";
import LineActions from "@/components/lines/LineActions.vue";
import MapsDialog from "@/components/maps/MapsDialog.vue";

const authStore = useAuthStore();
const tripsStore = useTripsStore();
// vsetko co je activeTrip bolo prehodene na activeTripReactive pre lepsiu reaktivitu !!!
const { activeTrip: activeTripReactive } = storeToRefs(tripsStore);
const linesStore = useLinesStore();
const route = useRoute();
const router = useRouter();
const $q = useQuasar();

const dialogVis = ref(false);
const draggableEnabled = ref(true);
const dragging = ref(false);

onMounted(() => {
	tripByIdLocal(route.params.tripId);
});

const openMapsDialog = () => {
	dialogVis.value = true;
};

const markers2Lines = async (markers, save = true) => {
	dialogVis.value = false;
	if (!save || !markers?.length || !activeTripReactive.value) return;
	for (const marker of markers) {
		const exists = activeTripReactive.value.lines.some((line) => Number(line.lat) === Number(marker.position.lat) && Number(line.lng) === Number(marker.position.lng));
		if (exists) {
			continue;
		}

		const lineData = {
			lineId: null,
			lat: marker.position.lat,
			lng: marker.position.lng,
			name: marker.title || "Unnamed Point",
			kmTotal: null,
			tulip: null,
			mapPage: null,
			roadNo: null,
			interest: [],
			stop: null,
			note: null,
			passed: false,
		};
		activeTripReactive.value.linesCount++;
		await createLineLocal(lineData);
	}
};

const deleteLinesLocal = async () => {
	if (!activeTripReactive.value) return;
	$q.dialog({
		title: "Confirm",
		message: "Are you sure you want to delete all lines?",
		cancel: true,
		persistent: true,
	}).onOk(async () => {
		$q.loading.show();
		try {
			await linesStore.deleteLines(activeTripReactive.value.tripId);
			// s tymto to blblo, ak sa po delete nastavovali nove markers, tak sa to neaktualizovalo, preto sa teraz po delete reloadne cely trip, aby sa to nastavilo spravne
			// asi to nie je uplne v poriadku ale delete sa nepouziva tak casto, mozno to tam nebude vobec
			// activeTripReactive.value.lines = [];
			// activeTripReactive.value.linesCount = 0;
			// activeTripReactive.value.hasLines = false;
			// activeTripReactive.value.mapMarkers = [];
			// Instead of just clearing the array, reload the trip to ensure reactivity
			await tripsStore.setActiveTrip(activeTripReactive.value.tripId);
			$q.loading.hide();
		} catch (err) {
			$q.dialog({ title: "Error", message: err.message || err });
			$q.loading.hide();
		}
	});
};
const tripByIdLocal = async (tripId) => {
	$q.loading.show();
	try {
		await tripsStore.setActiveTrip(tripId);
		$q.loading.hide();
	} catch (err) {
		$q.dialog({ title: "Error", message: err.message || err });
		$q.loading.hide();
	}
};

const updateTripLocal = async (tripData) => {
	tripData.userId = authStore.userId;
	$q.loading.show();
	try {
		await tripsStore.updateTrip(tripData);
		$q.loading.hide();
	} catch (err) {
		$q.dialog({ title: "Error", message: err.message || err });
		$q.loading.hide();
	}
	router.replace("/trips");
};

const createLineLocal = async (lineData) => {
	$q.loading.show();
	const lastOrder = activeTripReactive.value.lines.length;
	lineData.order = lastOrder + 1;
	lineData.tripId = activeTripReactive.value.tripId;
	try {
		await linesStore.createLine(lineData);
		$q.loading.hide();
	} catch (err) {
		$q.dialog({ title: "Error", message: err.message || err });
		$q.loading.hide();
	}
};

const lineIsEdited = () => {
	draggableEnabled.value = !draggableEnabled.value;
};

const onStart = (e) => {
	dragging.value = true;
};

const onEnd = async (e) => {
	dragging.value = false;
	activeTripReactive.value.lines.forEach((line, index) => {
		line.order = index + 1;
	});
	try {
		await linesStore.updateLines(activeTripReactive.value.lines, activeTripReactive.value.tripId);
		$q.loading.hide();
	} catch (err) {
		$q.dialog({ title: "Error", message: err.message || err });
		$q.loading.hide();
	}
};
</script>

<style scoped>
.ghost {
	opacity: 0.5;
	background: #c8ebfb;
}
</style>
