<template>
	<main>
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
	</main>
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
				this.$loadErrorMessage(this.$options.name, error);
			}
			this.isLoading = false;
		},
		goHome() {
			this.$router.push('/trips');
		},
		toggle() {
			this.fullscreen = !this.fullscreen;
		}
	},
};
</script>

<style scoped>

	@media (max-width: 46rem) {

		.go-home,
		.go-fullscreen {
			display: block;
		}
	}

	@media (min-width: 46rem) {

		.go-home,
		.go-fullscreen {
			display: none;
		}
	}

	.roadbook {
		width: calc(100% - 20px);
		margin: 0 auto;
		background-color: #fff;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		border: 1px solid #ccc;
	}

	.go-home,
	.go-fullscreen {
		position: fixed;
		top: 0.5rem;
		left: calc(50% - 2rem);
		background-color: #ffa700;
		color: #fff;
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
		text-align: center;
		line-height: 3rem;
		font-size: 1rem;
		text-decoration: none;
		z-index: 999;
	}

	.go-fullscreen {
		left: calc(50% + 2rem);
	}

	.go-home::after,
	.go-fullscreen::after {
		content: "Trips";
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		color: #fff;
		font-size: 14px;
		line-height: 1;
	}

	.go-fullscreen::after {
		content: "Full";
	}

	.go-home:hover,
	.go-fullscreen:hover {
		background-color: #fff;
		cursor: pointer;
	}

	.go-home:hover::after,
	.go-fullscreen:hover::after {
		color: #344a60;
		/* Change text color to green on hover */
	}

	.scrollable-content {
		height: 100vh;
		overflow-y: auto;
		padding: 20px;
	}

	:fullscreen {
		width: 100%;
		height: 100%;
	}

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