<template>
	<base-dialog @close="handleError" :show="!!error" title="An error is ocurred!">
		<p>{{ error }}</p>
	</base-dialog>
	<div v-if="isLoading">
		<base-spinner></base-spinner>
	</div>
	<div v-else>
		<section>
			<trip-full v-if="trip" :trip="trip"></trip-full>
			<ul v-if="hasLines">
				<line-view v-for="line in trip.lines" :key="line.id" :line="line"></line-view>
			</ul>
		</section>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import TripFull from '../../components/trips/TripFull.vue';
import LineView from '../../components/lines/LineView.vue';

export default {
	name: 'TripView',
	props: ['tripId'],
	components: {
		TripFull,
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
		handleError() {
			this.error = null;
		},
	},
};
</script>

<style scoped>
ul {
	width: 100%;
	padding: 0;
	list-style-type: none;
}
</style>