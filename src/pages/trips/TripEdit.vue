<template>
	<div>
		<base-dialog @close="handleError" :show="!!error" title="An error is ocurred!">
			<p>{{ error }}</p>
		</base-dialog>
		<section>
			<base-card>
				<h2>Trip:{{ tripId }}</h2>
				<div v-if="isLoading">
					<base-spinner></base-spinner>
				</div>
				<trip-form @save-data="saveData" :trip="localTrip"></trip-form>
			</base-card>
		</section>
	</div>
</template>

<script>
import TripForm from '../../components/trips/TripForm.vue';
export default {
	name: 'TripAdd',
	props: ['tripId'],
	components: {
		TripForm,
	},
	data() {
		return {
			isLoading: false,
			error: null,
			localTrip: null,
		};
	},
	created() {
		this.localTrip = this.$store.getters['trips/trips'].find(
			trip => trip.id === this.tripId
		);
	},
	methods: {
		async saveData(tripData) {
			this.isLoading = true;
			try {
				await this.$store.dispatch('trips/updateTrip', tripData);
			} catch (error) {
				this.error = `Component ${this.$options.name}, Padlo fetch : ${error.message}` || 'Something went wrong!';
				return;
			}

			this.isLoading = false;
			this.$router.replace('/trips');
		},
		handleError() {
			this.error = null;
		},
	},
};
</script>