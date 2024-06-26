<template>
	<!-- <router-link :to="tripViewLink"> -->
	<li class="line-item">
		<p>{{ line.order }}. {{ line.name }}</p>
		<p>{{ line.tulip }}</p>
		<p>{{ line.roadNo }}</p>
		<p>{{ line.note }}</p>
		<div class="actions">
			<base-button @click="deletineLineLocal">Delete</base-button>
		</div>
	</li>
	<!-- </router-link> -->
</template>
<script>
import { mapActions } from 'vuex';
export default {
	name: 'LineActions',
	props: {
		tripId: {
			type: String,
			required: true,
		},
		line: {
			type: Object,
			required: true,
			default: () => ({}),
		},
	},
	data() {
		return {
			isLoading: false,
			error: null,
		};
	},
	methods: {
		...mapActions('trips', ['deleteLine']),
		async deletineLineLocal() {
			this.isLoading = true;

			try {
				await this.deleteLine({ tripId: this.tripId, lineId: this.line.id });
			} catch (error) {
				this.error = `Component ${this.$options.name}, Padlo fetch : ${error.message}` || 'Something went wrong!';
				return;
			}
			this.isLoading = false;
		},
	}
};
</script>

<style scoped>
.draggable-list {
	background: #3f51b5;
	color: #fff;
	border: 1px solid;
	height: 50vh;
}

.list-item {
	margin: 10px;
	padding: 40px;
	cursor: pointer;
	font-size: 18px;
	border-radius: 5px;
	background: #f44336;
	display: inline-block;
}

.line-item {
	display: flex;
	/* Make the li a flex container */
	justify-content: space-between;
	/* Distribute the items evenly */
	align-items: center;
	/* Align the items vertically */
}

li {
	list-style-type: none;
	/* Remove the default bullet point */
	padding: 10px;
	/* Add some padding */
	margin-bottom: 10px;
	/* Add some space between list items */
	border: 1px solid #ddd;
	/* Add a border */
	border-radius: 5px;
	/* Round the corners */
	background-color: #f9f9f9;
	/* Add a background color */
	transition: background-color 0.3s ease;
	/* Add a transition for the hover effect */
}

li:hover {
	background-color: #e9e9e9;
	/* Change the background color when hovered over */
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