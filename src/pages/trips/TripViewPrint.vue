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
			<div v-if="hasLines" class="roadbook">
				<line-view v-for="line in trip.lines" :key="line.lineId" :line="line"></line-view>
			</div>
		</section>
	</div>
</template>

<script>
import { errorMixin } from '@/mixins/errorMixin';
import { mapGetters, mapActions } from 'vuex';
import TripFull from '../../components/trips/TripFull.vue';
import LineView from '../../components/lines/LineView.vue';

export default {
	name: 'TripView',
	mixins: [errorMixin],
	components: {
		TripFull,
		LineView,
	},
	data() {
		return {
			isLoading: false,
			error: null,
			tripId: null,
		};
	},
	computed: {
		...mapGetters('trips', ['trip', 'hasLines'])
	},
	async created() {
		this.tripId = this.$route.params.tripId;
		await this.tripByIdLocal(); // tu je await aby sa setLinesPassedFalse() urobila az potom
		this.setLinesPassedFalse();
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
		setLinesPassedFalse() {
			this.trip.lines.forEach(line => {
				line.passed = false;
			});
		},
	},
};
</script>

<style scoped>
	.roadbook {
		width: calc(100% - 20px);
		/* Adjust for body padding */
		margin: 0 auto;
		/* Center the roadbook */
		background-color: #fff;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		border: 1px solid #ccc;
	}
</style>