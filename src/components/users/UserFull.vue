<template>
	<div class="trip-full">
		<h3>{{ user.name }}</h3>
		<p>{{ user.description }}</p>
	</div>
</template>

<script>

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
		};
	},
	async created() {
		if (this.trip.imageName) await this.fetchImageUrlLocal();
	},
	methods: {
		async fetchImageUrlLocal() {
			const tripData = {
				tripId: this.trip.tripId,
				imageName: this.trip.imageName,
			};
			try {
				this.imageUrl = await this.$store.dispatch('tripsStorage/fetchImageUrl', tripData);
			} catch (error) {
				this.error = `Component ${this.$options.name}, Padlo fetch : ${error.message}` || 'Something went wrong!';
				return;
			}
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