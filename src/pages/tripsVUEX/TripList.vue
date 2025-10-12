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
				<div v-if="isAuthenticated" class="controls">
					<base-button link to="/trip/add">Add New Trip</base-button>
					<div v-if="isAdmin">
					<input id="interest-history" name="interest" type="checkbox" value="history" v-model="allTripsFlag"/>
					<label for="interest-history">Zobraziť tripy všetkých uživateľov</label>
				</div>
				</div>

				<div v-if="isLoading">
					<base-spinner></base-spinner>
				</div>
				<ul v-else-if="hasTrips">
					<trip-actions v-for="trip in filteredTrips" :key="trip.tripId" :trip-id="trip.tripId" :name="trip.name"
						:description="trip.description"></trip-actions>
				</ul>
				<h3 v-else>No trips found</h3>
			</base-card>
		</section>
	</main>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useError } from '@/composables/useError';
import TripActions from '../../components/trips/TripActions.vue';

export default {
	name: 'TripList',
	components: {
		TripActions,
	},
	setup() {
		const componentName = 'TripList';
		const store = useStore();
		const { error, setError, clearError } = useError(componentName);

		const isLoading = ref(false);
		const confirm = ref(false);

		// Vuex getters
		const isAuthenticated = computed(() => store.getters.isAuthenticated);
		const isAdmin = computed(() => store.getters.isAdmin);
		const trips = computed(() => store.getters['trips/trips']);
		const hasTrips = computed(() => store.getters['trips/hasTrips']);
		const allTripsFlag = ref(false);

		const filteredTrips = computed(() => {
			if (isAdmin.value && allTripsFlag.value) {
				return trips.value; // Admin sees all trips
			}
			else {
				return trips.value.filter(trip => trip.userId === store.getters.userId);
			}

		});


		onMounted(() => {
			loadTripsLocal();
		});

		async function loadTripsLocal(refresh = false) {
			isLoading.value = true;
			const userId = store.getters.userId;
			try {
				if (isAdmin.value) {
					await store.dispatch('trips/loadTripsOrdered');
				} else {
					await store.dispatch('trips/loadTripsOrderedByUserId', { userId: userId});
				}
			} catch (err) {
				setError(err.message || err);
			}
			isLoading.value = false;
		}

		return {
			componentName,
			error,
			clearError,
			isLoading,
			confirm,
			isAuthenticated,
			isAdmin,
			trips,
			hasTrips,
			loadTripsLocal,
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