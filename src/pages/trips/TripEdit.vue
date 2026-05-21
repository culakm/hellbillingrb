<template>
	<q-page class="q-pa-md">
		<trip-form v-if="isCreateMode" @save-data="saveTripLocal" />
		<template v-else-if="activeTripReactive">
			<trip-form
				:key="activeTripReactive.tripId"
				:trip="activeTripReactive"
				@save-data="saveTripLocal"
			/>
			<div class="row items-center q-mb-md q-gutter-sm">
				<q-btn
					color="primary"
					label="Open movable map"
					icon="map"
					no-caps
					@click="openMapsDialog"
				/>
				<q-btn
					color="negative"
					label="Delete all lines"
					icon="delete"
					no-caps
					@click="deleteLinesLocal"
				/>
				<maps-dialog
					v-if="dialogVis"
					:initial-markers="linesStore.mapMarkers"
					@save-markers="markers2Lines"
				/>
			</div>
			<q-list v-if="activeTripReactive?.lines?.length" separator>
				<VueDraggable
					ref="el"
					v-model="activeTripReactive.lines"
					item-key="lineId"
					:disabled="!draggableEnabled"
					:animation="150"
					ghost-class="ghost"
					@start="onStart"
					@end="onEnd"
				>
					<line-actions
						v-for="line in activeTripReactive.lines"
						:key="line.lineId"
						:line="line"
						@line-is-edited="lineIsEdited"
					/>
				</VueDraggable>
			</q-list>
			<div v-else class="text-grey q-mb-md">No lines found</div>
			<line-form @save-line="createLineLocal" />
		</template>
	</q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

import { useAuthStore } from '@/stores/auth';
import { useTripsStore } from '@/stores/trips';
import { useLinesStore } from '@/stores/lines';
import { useUsersStore } from '@/stores/users';
import { VueDraggable } from 'vue-draggable-plus';
import TripForm from '@/components/trips/TripForm.vue';
import LineForm from '@/components/lines/LineForm.vue';
import LineActions from '@/components/lines/LineActions.vue';
import MapsDialog from '@/components/maps/MapsDialog.vue';

const authStore = useAuthStore();
const tripsStore = useTripsStore();
const { activeTrip: activeTripReactive } = storeToRefs(tripsStore);
const linesStore = useLinesStore();
const usersStore = useUsersStore();
const route = useRoute();
const router = useRouter();
const $q = useQuasar();

const dialogVis = ref(false);
const draggableEnabled = ref(true);
const dragging = ref(false);

const isCreateMode = computed(() => !route.params.tripId);

const loadUsersIfNeeded = async () => {
	const trip = tripsStore.activeTrip;
	if (
		!authStore.isAdmin ||
		!trip?.userId ||
		trip.userId === authStore.userId ||
		usersStore.hasUsers
	) {
		return;
	}
	try {
		await usersStore.loadUsers();
	} catch (err) {
		$q.dialog({ title: 'Error', message: err.message || err });
	}
};

onMounted(async () => {
	if (isCreateMode.value) {
		activeTripReactive.value = null;
		return;
	}
	await tripByIdLocal(route.params.tripId);
	await loadUsersIfNeeded();
});

const openMapsDialog = () => {
	dialogVis.value = true;
};

const markers2Lines = async (markers, save = true) => {
	dialogVis.value = false;
	if (!save || !markers?.length || !activeTripReactive.value) return;
	for (const marker of markers) {
		const exists = activeTripReactive.value.lines.some(
			(line) =>
				Number(line.lat) === Number(marker.position.lat) &&
				Number(line.lng) === Number(marker.position.lng)
		);
		if (exists) {
			continue;
		}

		const lineData = {
			lineId: null,
			lat: marker.position.lat,
			lng: marker.position.lng,
			name: marker.title || 'Unnamed Point',
			kmTotal: null,
			tulip: null,
			mapPage: null,
			roadNo: null,
			interest: [],
			stop: null,
			note: null,
			passed: false,
		};
		await createLineLocal(lineData);
	}
};

const deleteLinesLocal = async () => {
	if (!activeTripReactive.value) return;
	$q.dialog({
		title: 'Confirm',
		message: 'Are you sure you want to delete all lines?',
		cancel: true,
		persistent: true,
	}).onOk(async () => {
		$q.loading.show();
		try {
			await linesStore.deleteLines(activeTripReactive.value.tripId);
			await tripsStore.setActiveTrip(activeTripReactive.value.tripId);
			$q.loading.hide();
		} catch (err) {
			$q.dialog({ title: 'Error', message: err.message || err });
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
		$q.dialog({ title: 'Error', message: err.message || err });
		$q.loading.hide();
	}
};

const saveTripLocal = async (tripData) => {
	if (isCreateMode.value) {
		tripData.userId = authStore.userId;
		$q.loading.show();
		try {
			await tripsStore.createTrip(tripData);
			await tripsStore.setActiveTrip(tripData.tripId);
			$q.loading.hide();
			router.replace({
				name: 'trip-edit',
				params: { tripId: tripData.tripId },
			});
		} catch (err) {
			$q.loading.hide();
			$q.dialog({ title: 'Error', message: err.message || err });
		}
		return;
	}

	tripData.userId = activeTripReactive.value.userId;
	$q.loading.show();
	try {
		await tripsStore.updateTrip(tripData);
		$q.loading.hide();
	} catch (err) {
		$q.dialog({ title: 'Error', message: err.message || err });
		$q.loading.hide();
	}
	router.replace('/trips');
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
		$q.dialog({ title: 'Error', message: err.message || err });
		$q.loading.hide();
	}
};

const lineIsEdited = () => {
	draggableEnabled.value = !draggableEnabled.value;
};

const onStart = () => {
	dragging.value = true;
};

const onEnd = async () => {
	dragging.value = false;
	activeTripReactive.value.lines.forEach((line, index) => {
		line.order = index + 1;
	});
	try {
		await linesStore.updateLines(
			activeTripReactive.value.lines,
			activeTripReactive.value.tripId
		);
		$q.loading.hide();
	} catch (err) {
		$q.dialog({ title: 'Error', message: err.message || err });
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
