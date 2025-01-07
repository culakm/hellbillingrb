<template>
	<form @submit.prevent="submitForm">
		<div class="form-control" :class="{ invalid: !name.isValid }">
			<label for="name">Name</label>
			<input type="text" id="name" v-model.trim="name.val" @blur="clearValidity('name')" />
			<p v-if="!name.isValid">name must not be empty!</p>
		</div>
		<div class="form-control" :class="{ invalid: !description.isValid }">
			<label for="description">Description</label>
			<textarea id="description" rows="5" v-model.trim="description.val"
				@blur="clearValidity('description')"></textarea>
			<p v-if="!description.isValid">Description must not be empty!</p>
		</div>

		<div>
			<div class="form-control">
				<input type="file" @change="previewImage" accept="image/*">

				<div v-if="uploadProgress > 0" class="progress">
					<p>Upload Progress: {{ uploadProgress }}%</p>
					<progress :value="uploadProgress" max="100"></progress>
				</div>

				<div v-if="imageData">
					<img :src="imagePreview" class="preview" alt="Preview">
					<button @click.prevent="uploadImage">Upload Image</button>
				</div>

			</div>

			<div v-if="imageUrl" class="display-section">
				<h3>Uploaded Image:</h3>
				<img :src="imageUrl" alt="Uploaded">
				<button @click.prevent="deleteImageLocal">Delete Image</button>
			</div>
		</div>


		<p v-if="!formIsValid">Please fix errors</p>
		<base-button v-if="Object.keys(trip).length === 0">Add Trip</base-button>
		<base-button v-else>Save Trip</base-button>
		<base-button link :to="tripViewLink">View</base-button>
	</form>
</template>

<script>
import { mapGetters } from 'vuex';
import { storage } from '../../firebase.js';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export default {
	name: 'TripForm',
	emits: ['save-data'],
	props: {
		trip: {
			type: Object,
			required: false,
			default: () => ({}),
		},
	},
	data() {
		return {
			name: {
				val: '',
				isValid: true
			},
			description: {
				val: '',
				isValid: true
			},
			imageName: {
				val: '',
				isValid: true
			},

			tripId: '',
			imageUrl: '',
			formIsValid: true,
			imageData: null,
			imagePreview: null,
			uploadProgress: 0,
			imageTestUrl: ''


		};
	},
	computed: {
		tripViewLink() {
			return `/trip/view/${this.tripId}`;
		},
	},
	async created() {
		if (this.trip.tripId) {
			this.tripId = this.trip.tripId
		}
		else {
			await this.setTripId();
		}

		this.name.val = this.trip.name || '';
		this.description.val = this.trip.description || '';
		this.imageName.val = this.trip.imageName || '';
		if (this.imageName.val) await this.fetchImageUrlLocal();
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
		async deleteImageLocal() {
			const tripData = {
				tripId: this.trip.tripId,
				imageName: this.trip.imageName,
			};
			// try {
			// 	await this.$store.dispatch('tripsStorage/deleteStorageObject', tripData);
			// 	await this.$store.dispatch('trips/deleteTripImage', tripData);
			// } catch (error) {
			// 	this.error = `Component ${this.$options.name}, Padlo fetch : ${error.message}` || 'Something went wrong!';
			// 	return;
			// }

			try {
				await Promise.all([
					this.$store.dispatch('tripsStorage/deleteStorageObject', tripData),
					this.$store.dispatch('trips/deleteTripImage', tripData)
				]);
			} catch (error) {
				console.error(`Component ${this.$options.name}, Padlo fetch : ${error.message}` || 'Something went wrong!')
				this.error = `Component ${this.$options.name}, Padlo fetch : ${error.message}` || 'Something went wrong!';
				return;
			}
			this.imageName.val = null;
			this.imageUrl = '';
		},
		async setTripId() {
			try {
				this.tripId = await this.$store.dispatch('trips/getTripNewId');
			} catch (error) {
				this.error = `Component ${this.$options.name}, Padlo fetch : ${error.message}` || 'Something went wrong!';
				return;
			}
		},
		async uploadImage() {
			if (!this.imageData) return
			this.imageName.val = this.imageData.name;
			const fileName = `trips/${this.tripId}/${this.imageData.name}`;
			const fileRef = storageRef(storage, fileName);
			const uploadTask = uploadBytesResumable(fileRef, this.imageData);

			uploadTask.on('state_changed',
				(snapshot) => {
					this.uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
				},
				(error) => {
					console.error('Upload failed:', error)
				},
				async () => {
					this.imageUrl = await getDownloadURL(fileRef);
					console.log('File available at:', this.imageUrl);
					this.imageData = null;
					this.imagePreview = null;
				}
			)
		},
		previewImage(event) {
			const file = event.target.files[0];
			if (!file) return;
			this.imageData = file;
			this.imagePreview = URL.createObjectURL(file)
			this.uploadProgress = 0
		},
		clearValidity(input) {
			this[input].isValid = true;
		},
		validateForm() {
			this.formIsValid = true;
			if (this.name.val === '') {
				this.name.isValid = false;
				this.formIsValid = false;
			}
		},
		submitForm() {
			this.validateForm();
			if (!this.formIsValid) return;

			const formData = {
				tripId: this.tripId,
				name: this.name.val,
				description: this.description.val,
				imageName: this.imageName.val,
			};
			this.$emit('save-data', formData);
		},
	},
};
</script>

<style scoped>
	.form-control {
		margin: 0.5rem 0;
	}

	label {
		font-weight: bold;
		display: block;
		margin-bottom: 0.5rem;
	}

	input[type='checkbox']+label {
		font-weight: normal;
		display: inline;
		margin: 0 0 0 0.5rem;
	}

	input,
	textarea {
		display: block;
		width: 100%;
		border: 1px solid #ccc;
		font: inherit;
	}

	input:focus,
	textarea:focus {
		background-color: #f0e6fd;
		outline: none;
		border-color: #3d008d;
	}

	input[type='checkbox'] {
		display: inline;
		width: auto;
		border: none;
	}

	input[type='checkbox']:focus {
		outline: #3d008d solid 1px;
	}

	.invalid label {
		color: red;
	}

	.invalid input,
	.invalid textarea {
		border: 1px solid red;
	}
</style>