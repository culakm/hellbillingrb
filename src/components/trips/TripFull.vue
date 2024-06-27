<template>
	<div class="trip-full">
		<h3>{{ trip.name }}</h3>
		<p>{{ trip.description }}</p>
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