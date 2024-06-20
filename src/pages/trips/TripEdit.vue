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
				<trip-form v-if="trip" @save-data="saveData" :trip="trip"></trip-form>
			</base-card>
		</section>
		<section>
			<base-card>
				<div v-if="isLoading">
					<base-spinner></base-spinner>
				</div>
				<line-form @save-line="saveLine" :trip="trip"></line-form>
			</base-card>
		</section>
		<section>
			<ul v-if="hasLines">
				<line-view v-for="line in trip.lines" :key="line.id" :line-id="line.id" :name="line.name"
					:note="line.note"></line-view>
			</ul>
		</section>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import TripForm from '../../components/trips/TripForm.vue';
import LineForm from '../../components/lines/LineForm.vue';
import LineView from '../../components/lines/LineView.vue';

export default {
	name: 'TripAdd',
	props: ['tripId'],
	components: {
		TripForm,
		LineForm,
		LineView,
	},
	data() {
		return {
			isLoading: false,
			error: null,
		};
	},
	computed: {
		...mapGetters('trips', ['trip', 'hasLines'])
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
		async saveLine(lineData) {
			this.isLoading = true;
			lineData.tripId = this.tripId;

			try {
				await this.$store.dispatch('trips/addLine', lineData);
			} catch (error) {
				this.error = `Component ${this.$options.name}, Padlo fetch : ${error.message}` || 'Something went wrong!';
				return;
			}

			this.isLoading = false;
		},
		handleError() {
			this.error = null;
		},
	},
};
</script>