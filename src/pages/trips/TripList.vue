<template>
	<q-page class="q-pa-md">
		<div class="row items-center q-mb-md q-gutter-sm">
			<div class="text-h6">Trips: {{ filteredTrips.length }}</div>
			<q-toggle
				v-if="authStore.isAdmin"
				v-model="allTripsFlag"
				label="All users' trips"
			/>
			<q-input v-model="filter" dense>
				<template #prepend>
					<q-icon name="search" />
				</template>
			</q-input>
			<q-space />
			<q-btn
				color="primary"
				label="Add Trip"
				icon="add"
				to="/trip/add"
				no-caps
			/>
		</div>
		<q-list v-if="tripsStore.hasTrips" separator>
			<trip-actions
				v-for="trip in filteredTrips"
				:key="trip.tripId"
				:trip="trip"
			/>
		</q-list>
		<div v-else class="text-grey">No trips found</div>
	</q-page>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useAuthStore } from '@/stores/auth';
import { useTripsStore } from '@/stores/trips';
import { useUsersStore } from '@/stores/users';
import TripActions from '@/components/trips/TripActions.vue';

const authStore = useAuthStore();
const tripsStore = useTripsStore();
const usersStore = useUsersStore();
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

const loadUsersIfNeeded = async () => {
	if (authStore.isAdmin && allTripsFlag.value && !usersStore.hasUsers) {
		try {
			await usersStore.loadUsers();
		} catch (err) {
			$q.dialog({ title: 'Error', message: err.message || err });
		}
	}
};

onMounted(async () => {
	const savedFlag = localStorage.getItem('allTripsFlag');
	if (authStore.isAdmin && savedFlag !== null) {
		allTripsFlag.value = savedFlag === 'true';
	}
	await loadTripsLocal();
	await loadUsersIfNeeded();
});

watch(allTripsFlag, (newValue) => {
	localStorage.setItem('allTripsFlag', newValue);
	loadUsersIfNeeded();
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
