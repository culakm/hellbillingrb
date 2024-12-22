<template>
	<div class="trip-full">
		<h3>{{ trip.name }}</h3>
		<p>{{ trip.description }}</p>
		<img v-if="trip.imageName" :src="imageUrl" alt="Uploaded">
	</div>
</template>

<script>
import { storage } from '../../firebase.js';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

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
	created() {
		this.fetchImageUrl();
	},
	methods: {
		async fetchImageUrl() {
			const fileName = `trips/${this.trip.id}/${this.trip.imageName}`;
			const fileRef = storageRef(storage, fileName);
			try {
				this.imageUrl = await getDownloadURL(fileRef);
			} catch (error) {
				console.error('Error fetching file URL:', error);
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