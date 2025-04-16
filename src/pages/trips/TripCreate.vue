<template>
	<main>
		<base-dialog @close="handleError" :show="!!error" title="An error is ocurred!">
			<p>{{ error }}</p>
		</base-dialog>
		<section>
			<base-card>
				<h2>Add Trip.</h2>
				<div v-if="isLoading">
					<base-spinner></base-spinner>
				</div>
				<trip-form @save-data="createTripLocal"></trip-form>
			</base-card>
		</section>
	</main>
</template>

<script>
import { errorMixin } from '@/mixins/errorMixin';
import { mapActions } from 'vuex';
import TripForm from '../../components/trips/TripForm.vue';
export default {
	name: 'TripCreate',
	mixins: [errorMixin],
	components: {
		TripForm,
	},
	data() {
		return {
			isLoading: false,
			error: null,
		};
	},
	methods: {
		...mapActions('trips', ['createTrip']),
		async createTripLocal(tripData) {
			this.isLoading = true;
			try {
				await this.createTrip(tripData);
			} catch (error) {
				this.$loadErrorMessage(this.$options.name, error);
				this.isLoading = false;
				return;
			}

			this.isLoading = false;
			this.$router.replace('/trips');
		},
	},
};
</script>