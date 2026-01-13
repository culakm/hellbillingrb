<template>
	<q-page class="q-pa-md bg-grey-2">
		<q-card>
			<q-card-section class="row items-center justify-between">
				<trip-form v-if="tripsStore.activeTrip" @save-data="updateTripLocal" :trip="tripsStore.activeTrip" />
			</q-card-section>
			<q-separator />
			<q-card-section>
				<VueDraggable v-if="activeTripReactive?.lines?.length" ref="el" v-model="activeTripReactive.lines" item-key="lineId" :disabled="!draggableEnabled" :animation="150" ghostClass="ghost" @start="onStart" @end="onEnd">
					<line-actions v-for="line in activeTripReactive.lines" :key="line.lineId" :line="line" :trip-id="activeTripReactive.tripId" @line-is-edited="lineIsEdited"></line-actions>
				</VueDraggable>
			</q-card-section>
			<q-separator />
			<q-card-section>
				<line-form v-if="tripsStore.activeTrip" @save-line="createLineLocal"></line-form>
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

const authStore = useAuthStore();
const tripsStore = useTripsStore();
const { activeTrip: activeTripReactive } = storeToRefs(tripsStore);
const linesStore = useLinesStore();
const route = useRoute();
const router = useRouter();
const $q = useQuasar();

const draggableEnabled = ref(true);
const dragging = ref(false);

onMounted(() => {
	tripByIdLocal(route.params.tripId);
});

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
	const lastOrder = tripsStore.activeTrip.lines.length;
	lineData.order = lastOrder + 1;
	lineData.tripId = tripsStore.activeTrip.tripId;
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
	tripsStore.activeTrip.lines.forEach((line, index) => {
		line.order = index + 1;
	});
	try {
		await linesStore.updateLines(tripsStore.activeTrip.lines, tripsStore.activeTrip.tripId);
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
