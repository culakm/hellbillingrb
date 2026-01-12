<template>
	<q-page class="q-pa-md bg-grey-2">
		<q-card>
			<q-card-section class="row items-center justify-between">
				<trip-form v-if="tripsStore.activeTrip" @save-data="updateTripLocal" :trip="tripsStore.activeTrip" />
			</q-card-section>
			<q-separator />
			<q-card-section>
				<draggable :list="tripsStore.activeTripLines" :disabled="!draggableEnabled" item-key="order" class="list-group" ghost-class="ghost" @start="dragging = true" @end="onEnd">
					<template #item="{ element }">
						<div class="list-group-item" :class="{ 'not-draggable': !draggableEnabled }">
							<line-actions :key="element.lineId" :line="element" :trip-id="tripsStore.activeTrip.tripId" @line-is-edited="lineIsEdited"></line-actions>
						</div>
					</template>
				</draggable>
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
import { useRoute } from "vue-router";
import { useQuasar } from "quasar";
import { useAuthStore } from "@/stores/auth";
import { useTripsStore } from "@/stores/trips";
import { useLinesStore } from "@/stores/lines";
import draggable from "vuedraggable";
import TripForm from "@/components/trips/TripForm.vue";
import LineForm from "@/components/lines/LineForm.vue";
import LineActions from "@/components/lines/LineActions.vue";

const authStore = useAuthStore();
const tripsStore = useTripsStore();
const linesStore = useLinesStore();
const route = useRoute();
const $q = useQuasar();

const draggableEnabled = ref(true);
const dragging = ref(false);

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
};

const createLineLocal = async (lineData) => {
	$q.loading.show();
	const lastOrder = tripsStore.activeTripLines.length;
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

const onEnd = async (evt) => {
	dragging.value = false;
	tripsStore.activeTripLines.forEach((line, index) => {
		line.order = index + 1;
	});
	try {
		await linesStore.updateLines(tripsStore.activeTripLines, tripsStore.activeTrip.tripId);
		$q.loading.hide();
	} catch (err) {
		$q.dialog({ title: "Error", message: err.message || err });
		$q.loading.hide();
	}
};

onMounted(() => {
	tripByIdLocal(route.params.tripId);
});
</script>

<style scoped>
.ghost {
	opacity: 0.5;
	background: #c8ebfb;
}

.not-draggable {
	cursor: no-drop;
}
</style>
