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
			<p>isLoading : {{ isLoading }}</p>
			<p>uploadProgress : {{ uploadProgress }}</p>
			<div class="form-control">
				<input type="file" @change="previewImage" accept="image/*">
				<div v-if="isLoading">
					<base-spinner></base-spinner>
				</div>
				<!-- <div v-if="uploadProgress > 0" class="progress">
					<p>Upload Progress: {{ uploadProgressRounded }}%</p>
					<progress :value="uploadProgress" max="100"></progress>
				</div> -->
				<div v-if="uploadProgress > 0 && uploadProgress < 100" class="progress">
					{{ Math.round(uploadProgress) }}% VS. {{ uploadProgressRounded }}%
					<progress :value="uploadProgress" max="100"></progress>
				</div>
				<div v-else-if="imageData">
					<button @click.prevent="uploadImage">Upload Image</button>
					<img :src="imagePreview" class="preview" alt="Preview">
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
import { mapActions, mapGetters } from 'vuex';
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
			isLoading: false,
			//uploadProgress: 0,


		};
	},
	computed: {
		...mapGetters('tripsStorage', ['uploadProgressState']),
		tripViewLink() {
			return `/trip/view/${this.tripId}`;
		},
		uploadProgressRounded() {
			return Math.round(this.uploadProgress);
		},
		// uploadProgress() {
		// 	return this.uploadProgressState;
		// },
		uploadProgress: {
			get() {
				return this.$store.getters['tripsStorage/uploadProgressState'];
			},
			set(newValue) {
				this.$store.commit('tripsStorage/setUploadProgress', newValue);
			}
		}

	},
	async created() {
		console.log('TripForm created');
		console.log('this.uploadProgressState', this.uploadProgressState);
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
		...mapActions({
			deleteTripImage: 'trips/deleteTripImage',
			updateTripImage: 'trips/updateTripImage',
			getTripNewId: 'trips/getTripNewId',
			fetchImageUrl: 'tripsStorage/fetchImageUrl',
			uploadStorageObject: 'tripsStorage/uploadStorageObject',
			deleteStorageObject: 'tripsStorage/deleteStorageObject'

		}),
		async fetchImageUrlLocal() {
			const tripData = {
				tripId: this.trip.tripId,
				imageName: this.trip.imageName,
			};
			try {
				this.imageUrl = await this.fetchImageUrl(tripData);
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
			try {
				await Promise.all([
					this.deleteStorageObject(tripData),
					this.deleteTripImage(tripData)
				]);
			} catch (error) {
				this.error = `Component ${this.$options.name}, Padlo fetch : ${error.message}` || 'Something went wrong!';
				return;
			}
			this.imageName.val = null;
			this.imageUrl = '';
		},
		async setTripId() {
			try {
				this.tripId = await this.getTripNewId();
			} catch (error) {
				this.error = `Component ${this.$options.name}, Padlo fetch : ${error.message}` || 'Something went wrong!';
				return;
			}
		},
		async uploadImage() {
			if (!this.imageData) return;

			if (this.imageName.val) await this.deleteImageLocal();

			this.imageName.val = this.imageData.name;
			const file = this.imageData;
			this.isLoading = true;
			try {
				const fileName = `trips/${this.tripId}/${this.imageData.name}`;

				const downloadURL = await this.uploadStorageObject({
					file,
					path: fileName
				});

				// Handle successful upload, e.g., save URL to Firestore
				this.imageUrl = downloadURL;
			} catch (error) {
				console.error('Error in uploadImage:', error);
				throw error;
			}
			const tripData = {
				tripId: this.tripId,
				imageName: this.imageData.name,
			};
			this.isLoading = false;
			//try tu ma byt a asi to treba spojit s await Promise.all([
			this.updateTripImage(tripData);
		},
		async uploadImageAI(file) {
			try {
				const tripId = this.tripId; // Assuming you have tripId in your component
				const fileName = `trips/${tripId}/${file.name}`;

				const downloadURL = await this.$store.dispatch('uploadStorageObject', {
					file,
					path: fileName
				});

				// Handle successful upload, e.g., save URL to Firestore
				return downloadURL;
			} catch (error) {
				console.error('Error in uploadImage:', error);
				throw error;
			}
		},
		async uploadImageV1() {

			if (!this.imageData) return;

			if (this.imageName.val) await this.deleteImageLocal();

			this.imageName.val = this.imageData.name;
			const fileName = `trips/${this.tripId}/${this.imageData.name}`;
			const fileRef = storageRef(storage, fileName);
			const uploadTask = uploadBytesResumable(fileRef, this.imageData);
			this.isLoading = true;
			uploadTask.on('state_changed',
				(snapshot) => {
					this.uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				},
				//null,
				(error) => {
					console.error('Upload failed:', error);
				},
				async () => {
					this.imageUrl = await getDownloadURL(fileRef);
					console.log('File available at:', this.imageUrl);
					this.imageData = null;
					this.imagePreview = null;
					this.isLoading = false;
					this.uploadProgress = 0;
				}
			);
			const tripData = {
				tripId: this.tripId,
				imageName: this.imageData.name,
			};

			//try tu ma byt a asi to treba spojit s await Promise.all([
			this.updateTripImage(tripData);

		},
		previewImage(event) {
			const file = event.target.files[0];
			if (!file) return;
			this.imageData = file;
			this.imagePreview = URL.createObjectURL(file);
			console.log('this.uploadProgress in previewImage 1', this.uploadProgress);
			this.uploadProgress = 0
			console.log('this.uploadProgress in previewImage 2', this.uploadProgress);
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

			const tripData = {
				tripId: this.tripId,
				name: this.name.val,
				description: this.description.val,
				imageName: this.imageName.val,
			};
			this.$emit('save-data', tripData);
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