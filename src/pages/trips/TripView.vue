<template>
	<div class="go-home" @click="goHome()"></div>
	<div class="go-fullscreen" @click="toggle()"></div>
	<base-dialog @close="handleError" :show="!!error" title="An error is ocurred!">
		<p>{{ error }}</p>
	</base-dialog>
	<div v-if="isLoading">
		<base-spinner></base-spinner>
	</div>
	<div v-else>
		<fullscreen v-model="fullscreen">
			<div class="scrollable-content">
				<section>
					<trip-full v-if="trip" :trip="trip"></trip-full>
					<div v-if="hasLines" class="roadbook">
						<line-view v-for="line in trip.lines" :key="line.lineId" :line="line"></line-view>
					</div>
				</section>
			</div>
		</fullscreen>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import TripFull from '../../components/trips/TripFull.vue';
import LineView from '../../components/lines/LineView.vue';

export default {
	name: 'TripView',
	components: {
		TripFull,
		LineView,
	},
	data() {
		return {
			fullscreen: false,
			isLoading: false,
			error: null,
			tripId: null,
		};
	},
	computed: {
		...mapGetters('trips', ['trip', 'hasLines'])
	},
	created() {
		this.tripId = this.$route.params.tripId;
		this.tripByIdLocal();
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
		toggle() {
			this.fullscreen = !this.fullscreen;
		},
		handleError() {
			this.error = null;
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
		z-index: 999;
		/* Ensure it's above other content */
	}

	.go-home::after {
		content: "Trips";
		/* Text you want to add */
		position: absolute;
		top: 50%;
		/* Center vertically */
		left: 50%;
		/* Center horizontally */
		transform: translate(-50%, -50%);
		/* Adjust both horizontally and vertically */
		color: #fff;
		/* Text color */
		font-size: 14px;
		/* Text size */
		line-height: 1;
		/* Ensure the text aligns properly */
	}

	.go-home:hover {
		background-color: #0056b3;
		cursor: pointer;
		/* Indicates a clickable element, commonly used for links */
	}

	.go-fullscreen {
		position: fixed;
		top: 80px;
		right: 20px;
		background-color: #ff3c00;
		color: #fff;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		text-align: center;
		line-height: 40px;
		font-size: 24px;
		text-decoration: none;
		z-index: 999;
		/* Ensure it's above other content */
	}

	.go-fullscreen::after {
		content: "Full";
		/* Text you want to add */
		position: absolute;
		top: 50%;
		/* Center vertically */
		left: 50%;
		/* Center horizontally */
		transform: translate(-50%, -50%);
		/* Adjust both horizontally and vertically */
		color: #fff;
		/* Text color */
		font-size: 14px;
		/* Text size */
		line-height: 1;
		/* Ensure the text aligns properly */
	}

	.go-fullscreen:hover {
		background-color: #a32600;
		cursor: pointer;
		/* Indicates a clickable element, commonly used for links */
	}

	.scrollable-content {
		height: 100vh;
		/* Full viewport height */
		overflow-y: auto;
		/* Enable vertical scrolling */
		padding: 20px;
		/* Add some padding */
	}

	/* Ensure the fullscreen element takes up the full screen */
	:fullscreen {
		width: 100%;
		height: 100%;
	}

	/* Styles for browsers that don't support :fullscreen */
	:-webkit-full-screen {
		width: 100%;
		height: 100%;
	}

	:-moz-full-screen {
		width: 100%;
		height: 100%;
	}

	:-ms-fullscreen {
		width: 100%;
		height: 100%;
	}
</style>