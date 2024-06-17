<template>
	<div>
		<base-dialog :show="!!confirm" title="Really???">
			<p>Are you shure you want to delete this trip?</p>
		</base-dialog>
		<section>
			<base-card>
				<div v-if="isLoggedIn" class="controls">
					<base-button link to="/trips/add">Add New Trip</base-button>
				</div>
				<div v-if="isLoading">
					<base-spinner></base-spinner>
				</div>
				<ul v-else-if="hasTrips">
					<trip v-for="trip in trips" :key="trip.id" :trip-id="trip.id" :name="trip.name"></trip>
				</ul>
				<h3 v-else>No trips found</h3>
			</base-card>
		</section>
	</div>
</template>

<script>
import Trip from '../../components/trips/Trip.vue';
export default {
	name: 'TripsList',
	components: {
		Trip,
	},
	data() {
		return {
			isLoading: false,
			error: null,
			confirm: false,
		};
	},
	computed: {
		trips() {
			return this.$store.getters['trips/trips'];
		},
		hasTrips() {
			return !this.isLoading && this.$store.getters['trips/hasTrips'];
		},
		isLoggedIn() {
			return this.$store.getters.isAuthenticated;
		},
	},
	created() {
		this.loadTrips();
	},
	methods: {
		handleError() {
			this.error = null;
		},
		async loadTrips(refresh = false) {
			this.isLoading = true;
			try {
				await this.$store.dispatch('trips/loadTrips', { forcedRefresh: refresh });
			} catch (error) {
				// this.$options.name musi byt definovene name v komponente
				this.error = `Component ${this.$options.name}, Padlo tralalsdfas: ${error.message}` || 'Something went wrong!';
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
</style>