<template>
	<div>
		<base-dialog :show="!!error" title="An error occured..." @close="handleError">
			<p>{{ error }}</p>
		</base-dialog>
		<base-dialog :show="!!confirm" title="Really???">
			<p>Are you shure you want to delete this trip?</p>
		</base-dialog>
		<section>
			<base-card>
				<div v-if="isAuthenticated" class="controls">
					<base-button link to="/trip/add">Add New Trip</base-button>
				</div>
				<div v-if="isLoading">
					<base-spinner></base-spinner>
				</div>
				<ul v-else-if="hasTrips">
					<trip-actions v-for="trip in trips" :key="trip.id" :trip-id="trip.id" :name="trip.name"
						:description="trip.description"></trip-actions>
				</ul>
				<h3 v-else>No trips found</h3>
			</base-card>
		</section>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import TripActions from '../../components/trips/TripActions.vue';
export default {
	name: 'TripsList',
	components: {
		TripActions,
	},
	data() {
		return {
			isLoading: false,
			error: null,
			confirm: false,
		};
	},
	computed: {
		...mapGetters(['isAuthenticated']),
		...mapGetters('trips', ['trips', 'hasTrips']),
	},
	created() {
		this.loadTripsLocal();
	},
	methods: {
		...mapActions('trips', ['loadTrips']),
		handleError() {
			this.error = null;
		},
		async loadTripsLocal(refresh = false) {
			this.isLoading = true;
			try {
				await this.loadTrips({ forcedRefresh: refresh });
			} catch (error) {
				// this.$options.name musi byt definovene name v komponente
				this.error = `Component ${this.$options.name}, error: ${error.message}` || 'Something went wrong!';
			}
			this.isLoading = false;
		},
	},

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
	justify-content: space-between;
}
</style>../../components/trips/TripActions.vue