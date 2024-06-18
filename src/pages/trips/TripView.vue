<template>
	<div v-if="isLoading">
		<base-spinner></base-spinner>
	</div>
	<div v-else>
		<section>
			<base-card>
				<h2>Trip:{{ tripId }} Trip View</h2>
				<div v-if="isLoading">
					<base-spinner></base-spinner>
				</div>
				<trip-full :trip="trip"></trip-full>
			</base-card>
		</section>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import TripFull from '../../components/trips/TripFull.vue';
export default {
	name: 'TripView',
	props: ['tripId'],
	components: {
		TripFull,
	},
	data() {
		return {
			isLoading: false,
			error: null,
			localTrip: null,
		};
	},
	computed: {
		...mapGetters('trips', ['trips', 'trip'])
	},
	async created() {
		const tripId = this.$route.params.tripId;
		this.tripByIdLocal(tripId);
	},
	methods: {
		...mapActions('trips', ['tripById']),
		async tripByIdLocal() {
			this.isLoading = true;
			try {
				await this.tripById(this.tripId);
			} catch (error) {
				this.error = `Component ${this.$options.name}, error: ${error.message}` || 'Something went wrong!';
			}
			this.isLoading = false;
		},
		handleError() {
			this.error = null;
		},
	},
};
</script>