<template>
	<q-page class="q-pa-md bg-grey-2">
		<q-card>
			<q-card-section class="row items-center justify-between">
				<div class="row items-center col">
					<div class="text-h6">Trips: {{ filteredTrips.length }}</div>
					<q-toggle v-if="authStore.isAdmin" v-model="allTripsFlag" label="All users' trips" class="q-ml-md" />
				</div>
				<div class="col-auto q-ml-auto">
					<q-btn color="primary" label="Add Trip" icon="add" to="/trip/add" />
				</div>
			</q-card-section>
			<q-separator />
			<q-list v-if="tripsStore.hasTrips" bordered separator>
				<trip-actions v-for="trip in filteredTrips" :key="trip.tripId" :trip-id="trip.tripId" :name="trip.name" :description="trip.description" :image-name="trip.imageName" />
			</q-list>
			<q-card-section v-else>
				<div class="text-grey">No trips found</div>
			</q-card-section>
		</q-card>
	</q-page>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useAuthStore } from "@/stores/auth";
import { useTripsStore } from "@/stores/trips";
import TripActions from "@/components/trips/TripActions.vue";

const authStore = useAuthStore();
const tripsStore = useTripsStore();
const $q = useQuasar();

const allTripsFlag = ref(false);

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
		$q.dialog({ title: "Error", message: err.message || err });
		$q.loading.hide();
	}
	$q.loading.hide();
};

onMounted(async () => {
	const savedFlag = localStorage.getItem("allTripsFlag");
	if (authStore.isAdmin && savedFlag !== null) {
		allTripsFlag.value = savedFlag === "true";
	}
	await loadTripsLocal();
});

watch(allTripsFlag, (newValue) => {
	localStorage.setItem("allTripsFlag", newValue);
});

const filteredTrips = computed(() => {
	if (authStore.isAdmin && allTripsFlag.value) {
		return tripsStore.trips;
	} else {
		return tripsStore.trips.filter((trip) => trip.userId === authStore.userId);
	}
});
</script>
