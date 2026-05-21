<template>
	<q-page class="q-pa-md">
		<div ref="pageRef">
			<trip-full
				v-if="tripsStore.activeTrip"
				:trip="tripsStore.activeTrip"
				:page-ref="pageRef"
			></trip-full>
			<div v-if="tripsStore.activeTrip?.hasLines" class="lines">
				<line-view
					v-for="line in tripsStore.activeTrip.lines"
					:key="line.lineId"
					:line="line"
					:lines-count="tripsStore.activeTrip.linesCount"
				></line-view>
			</div>
		</div>
	</q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useTripsStore } from '@/stores/trips';
import { useUsersStore } from '@/stores/users';
import { useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import TripFull from '@/components/trips/TripFull.vue';
import LineView from '@/components/lines/LineView.vue';

const authStore = useAuthStore();
const tripsStore = useTripsStore();
const usersStore = useUsersStore();
const route = useRoute();
const $q = useQuasar();

const pageRef = ref(null);

const tripByIdLocal = async (tripId) => {
	$q.loading.show();
	try {
		await tripsStore.setActiveTrip(tripId);
		$q.loading.hide();
	} catch (err) {
		$q.loading.hide();
		$q.dialog({ title: 'Error', message: err.message || err });
	}
};

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
	await tripByIdLocal(route.params.tripId);
	await loadUsersIfNeeded();
});
</script>

<style scoped>
/* toto je tu kvoli scrolovaniu vo fullscreene */
:fullscreen,
:-webkit-full-screen {
	overflow: auto !important;
}
</style>

<style>
.lines > .roadbook-item + .roadbook-item {
	margin-top: -2px;
}
</style>
