<template>
	<base-dialog @close="handleError" :show="!!error" title="An error is ocurred!">
		<p>{{ error }}</p>
	</base-dialog>
	<div class="trip-full">
		<h3>{{ trip.name }}</h3>
		<p>{{ trip.description }}</p>
		<p>linesCount: {{ trip.linesCount }}</p>
		<img v-if="trip.imageName" :src="imageUrl" alt="Downloaded">
	</div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
	props: {
		trip: {
			type: Object,
			required: false,
			default: () => ({}),
		},
	},
	data() {
		return {
			imageUrl: '',
			error: null,
		};
	},
	async created() {
		if (this.trip.imageName) await this.fetchImageUrlLocal();
	},
	methods: {
		...mapActions('tripsStorage', ['fetchImageUrl']),
		async fetchImageUrlLocal() {
			const tripData = {
				tripId: this.trip.tripId,
				imageName: this.trip.imageName,
			};
			try {
				this.imageUrl = await this.fetchImageUrl(tripData);
			} catch (error) {
				this.$loadErrorMessage(this.$options.name, error);
			}
		},
		handleError() {
			this.error = null;
		},
	},
};
</script>

<style scoped>
	.trip-full {
		margin: 1rem;
	}

	h3 {
		margin: 0.5rem 0;
	}
</style>