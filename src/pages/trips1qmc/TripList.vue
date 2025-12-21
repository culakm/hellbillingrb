<template>
	<main>
		<base-dialog @close="clearError" :show="!!error" title="An error is ocurred!">
			<p>{{ error }}</p>
		</base-dialog>
		<base-dialog :show="!!confirm" title="Really???">
			<p>Are you shure you want to delete this trip?</p>
		</base-dialog>
		<section>
			<base-card>
				<div v-if="authStore.isAuthenticated" class="controls">
					<base-button link to="/trip/add">Add New Trip ja som QMC!!</base-button>
					<div v-if="authStore.isAdmin">
					<input id="all-trips-flag" name="allTripsFlag" type="checkbox" v-model="allTripsFlag"/>
					<label for="all-trips-flag">Zobraziť tripy všetkých uživateľov</label>
					<p>Trips Count: {{ filteredTrips.length }}</p>
				</div>
				</div>
				<div v-if="isLoading">
					<base-spinner></base-spinner>
				</div>
				<ul v-else-if="tripsStore.hasTrips">
					<trip-actions v-for="trip in filteredTrips" :key="trip.tripId" :trip-id="trip.tripId" :name="trip.name" :description="trip.description"></trip-actions>
				</ul>
				<h3 v-else>No trips found</h3>
			</base-card>
		</section>
	</main>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useTripsStore } from '@/stores/trips';
import { useError } from '@/composables/useError';
import TripActions from '../../components/trips/TripActions.vue';

export default {
	name: 'TripList',
	components: {
		TripActions,
	},
	setup() {
		const componentName = 'TripList';
		const authStore = useAuthStore();
		const tripsStore = useTripsStore();
		const { error, setError, clearError } = useError(componentName);

		const isLoading = ref(false);
		const allTripsFlag = ref(false);
		const confirm = ref(false);

		onMounted(async () => {
			const savedFlag = localStorage.getItem('allTripsFlag');
			if (authStore.isAdmin && savedFlag !== null) {
				allTripsFlag.value = savedFlag === 'true';
			}
			loadTripsLocal();
		});

		watch(allTripsFlag, (newValue) => {
			localStorage.setItem('allTripsFlag', newValue);
		})

		async function loadTripsLocal() {
			isLoading.value = true;
			const userId = authStore.userId;
			try {
				if (authStore.isAdmin) {
					await tripsStore.loadTrips()
				} else {
					await tripsStore.loadTrips(userId);
				}
			} catch (err) {
				setError(err.message || 'Failed to load trips');
			}
			isLoading.value = false;
		}

		const filteredTrips = computed(() => {
			if (authStore.isAdmin && allTripsFlag.value) {
				return tripsStore.trips;
			}
			else {
				return tripsStore.trips.filter(trip => trip.userId === authStore.userId);
			}

		});

		return {
			error,
			clearError,
			isLoading,
			confirm,
			authStore,
			tripsStore,
			allTripsFlag,
			filteredTrips
		};
	}
};
</script>

<style scoped>
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.controls {
		display: flex;
		justify-content: left;
	}
</style>