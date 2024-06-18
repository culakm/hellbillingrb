<template>
	<li>
		<h3>id: {{ tripId }} Actions</h3>
		<h3>{{ name }}</h3>
		<p>{{ description }}</p>
		<div class="actions">
			<base-button link :to="tripViewLink">View</base-button>
			<base-button link :to="tripEditLink">Edit</base-button>
			<base-button @click="deleteTrip">Delete</base-button>
		</div>
	</li>
</template>

<script>
export default {
	name: 'TripActions',
	props: ['tripId', 'name', 'description'],
	computed: {
		tripViewLink() {
			return this.$route.path + `/view/${this.tripId}`;
		},
		tripEditLink() {
			return this.$route.path + `/${this.tripId}`;
		},
	},
	methods: {
		deleteTrip() {
			this.$store.dispatch('trips/deleteTrip', { tripId: this.tripId });
			this.$router.replace('/trips');
		},
	}
};
</script>

<style scoped>
li {
	margin: 1rem 0;
	border: 1px solid #424242;
	border-radius: 12px;
	padding: 1rem;
}

h3 {
	font-size: 1.5rem;
}

h3,
h4 {
	margin: 0.5rem 0;
}

div {
	margin: 0.5rem 0;
}

.actions {
	display: flex;
	justify-content: flex-end;
}
</style>