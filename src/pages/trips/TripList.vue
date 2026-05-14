<template>
	<q-page class="q-pa-xs q-pr-lg">
		<q-card-section class="q-py-none row items-center justify-between">
			<div class="row items-center col">
				<div class="text-h6">Trips: {{ filteredTrips.length }}</div>
				<q-toggle
					v-if="authStore.isAdmin"
					v-model="allTripsFlag"
					label="All users' trips"
					class="q-ml-md"
				/>
				<q-input v-model="filter" class="q-ml-md" dense>
					<template #prepend>
						<q-icon name="search" />
					</template>
				</q-input>
			</div>
			<div class="col-auto q-ml-auto">
				<q-btn color="primary" label="Add Trip" icon="add" to="/trip/add" />
			</div>
		</q-card-section>
		<q-card-section
			v-if="tripsStore.hasTrips"
			class="q-pa-xs"
			bordered
			separator
		>
			<trip-actions
				v-for="trip in filteredTrips"
				:key="trip.tripId"
				class="q-pr-md q-pl-md"
				:trip-id="trip.tripId"
				:name="trip.name"
				:description="trip.description"
				:image-name="trip.imageName"
			/>
		</q-card-section>
		<q-card-section v-else>
			<div class="text-grey">No trips found</div>
		</q-card-section>
	</q-page>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useAuthStore } from '@/stores/auth';
import { useTripsStore } from '@/stores/trips';
import TripActions from '@/components/trips/TripActions.vue';

const authStore = useAuthStore();
const tripsStore = useTripsStore();
const $q = useQuasar();

const allTripsFlag = ref(false);
const filter = ref('');

const loadTripsLocal = async () => {
	$q.loading.show();
	const userId = authStore.userId;
	try {
		if (authStore.isAdmin) {
			await tripsStore.loadTrips();
		} else {
			await tripsStore.loadTrips(userId);
		}
	} catch (err) {
		$q.dialog({ title: 'Error', message: err.message || err });
		$q.loading.hide();
	}
	$q.loading.hide();
};

onMounted(async () => {
	const savedFlag = localStorage.getItem('allTripsFlag');
	if (authStore.isAdmin && savedFlag !== null) {
		allTripsFlag.value = savedFlag === 'true';
	}
	await loadTripsLocal();
});

watch(allTripsFlag, (newValue) => {
	localStorage.setItem('allTripsFlag', newValue);
});

const filteredTrips = computed(() => {
	const search = filter.value.trim().toLowerCase();

	const visibleTrips =
		authStore.isAdmin && allTripsFlag.value
			? tripsStore.trips
			: tripsStore.trips.filter((trip) => trip.userId === authStore.userId);

	if (!search) {
		return visibleTrips;
	}

	return visibleTrips.filter((trip) => {
		const name = (trip.name ?? '').toLowerCase();
		const description = (trip.description ?? '').toLowerCase();
		return name.includes(search) || description.includes(search);
	});
});
</script>
