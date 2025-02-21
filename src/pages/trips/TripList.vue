<template>
	<div>
		<base-dialog @close="handleError" :show="!!error" title="An error is ocurred!">
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
					<trip-actions v-for="trip in trips" :key="trip.tripId" :trip-id="trip.tripId" :name="trip.name"
						:description="trip.description"></trip-actions>
				</ul>
				<h3 v-else>No trips found</h3>
			</base-card>
		</section>
	</div>
</template>

<script>
import { errorMixin } from '@/mixins/errorMixin';

import { mapGetters, mapActions } from 'vuex';
import TripActions from '../../components/trips/TripActions.vue';
export default {
	name: 'TripList',
	mixins: [errorMixin],
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
		...mapActions('trips', ['loadTripsOrdered']),
		async loadTripsLocal(refresh = false) {
			this.isLoading = true;
			try {
				await this.loadTripsOrdered({ forcedRefresh: refresh });
			} catch (error) {
				this.error = `Component ${this.$options.name}, error: ${error.message}` || 'Something went wrong!';
			}
			this.isLoading = false;
		}
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