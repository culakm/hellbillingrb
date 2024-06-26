<template>
	<div class="go-home" @click="goHome()"></div>
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
				<line-view v-for="line in trip.lines" :key="line.id" :line="line" :trip-id="tripId"></line-view>
			</div>
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
		goHome() {
			this.$router.push('/trips');
		},
		handleError() {
			this.error = null;
		},
	},
};
</script>

<style scoped>
.roadbook {
  width: calc(100% - 20px); /* Adjust for body padding */
  margin: 0 auto; /* Center the roadbook */
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #ccc;
}

.go-home {
	position: fixed;
	top: 20px;
	right: 20px;
	background-color: #007bff;
	color: #fff;
	width: 40px;
	height: 40px;
	border-radius: 50%;
	text-align: center;
	line-height: 40px;
	font-size: 24px;
	text-decoration: none;
	z-index: 999; /* Ensure it's above other content */
}

.go-home::after {
    content: "Trips"; /* Text you want to add */
    position: absolute;
    top: 50%; /* Center vertically */
    left: 50%; /* Center horizontally */
    transform: translate(-50%, -50%); /* Adjust both horizontally and vertically */
    color: #fff; /* Text color */
    font-size: 14px; /* Text size */
    line-height: 1; /* Ensure the text aligns properly */
}

.go-home:hover {
    background-color: #0056b3;
    cursor: pointer; /* Indicates a clickable element, commonly used for links */
}
</style>