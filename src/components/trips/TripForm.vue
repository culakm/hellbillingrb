<template>
	<base-dialog @close="handleError" :show="!!error" title="An error is ocurred!">
		<p>{{ error }}</p>
	</base-dialog>
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
				<div v-if="isLoading">
					<base-spinner></base-spinner>
				</div>
				<div v-if="uploadProgressLocal > 0 && uploadProgressLocal < 100" class="progress">
					{{ uploadProgressLocal }}%
					<progress :value="uploadProgressLocal" max="100"></progress>
				</div>
				<div v-else>
					<div v-if="!imageSrc">
						<p>No image selected</p>
					</div>
					<div v-else>
						<!-- <div v-if="imageData">
							<button @click.prevent="uploadImageLocal">Upload Image</button>
						</div> -->
						<base-button @click.prevent="deleteImageCurrent">Delete Image</base-button>
						<img :src="imageSrc" alt="trip image" style="max-width: 100%; max-height: 200px;">
					</div>
				</div>
			</div>
		</div>


		<p v-if="!formIsValid">Please fix errors</p>
		<div class="controls">
			<base-button v-if="Object.keys(trip).length === 0">Add Trip</base-button>
			<base-button v-else>Save Trip</base-button>
			<base-button v-if="Object.keys(trip).length > 0" link :to="tripViewLink">View</base-button>
		</div>
	</form>
</template>

<script>
import { errorMixin } from '@/mixins/errorMixin';
import { mapActions } from 'vuex';

export default {
	name: 'TripForm',
	mixins: [errorMixin],
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
			isLoading: false,
			error: null,
			formIsValid: true,
			imageUrl: '',
			imageData: null,
			imagePreview: null,
			imageNameOriginal: '',
		};
	},
	computed: {
		tripViewLink() {
			return `/trip/view/${this.tripId}`;
		},
		uploadProgressLocal: {
			get() {
				return this.$store.getters['tripsStorage/uploadProgress'];
			},
			set(newValue) {
				this.$store.commit('tripsStorage/setUploadProgress', newValue);
			}
		},
		imageSrc() {
			return this.imagePreview ? this.imagePreview : this.imageUrl;
		},
	},
	async created() {
		if (this.trip.tripId) {
			this.tripId = this.trip.tripId;
		} else {
			await this.setTripId();
		}

		this.name.val = this.trip.name || '';
		this.description.val = this.trip.description || '';
		this.imageName.val = this.trip.imageName || '';
		if (this.imageName.val) {
			await this.fetchImageUrlLocal();
			this.imageNameOriginal = this.imageName.val;
		}
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
		async setTripId() {
			try {
				this.tripId = await this.getTripNewId();
			} catch (error) {
				this.$loadErrorMessage(this.$options.name, error);
			}
		},
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
				this.$loadErrorMessage(this.$options.name, error);
			}
		},
		previewImage(event) {
			const file = event.target.files[0];
			if (!file) return;
			this.imageData = file;
			this.imagePreview = URL.createObjectURL(file);
			this.uploadProgressLocal = 0;
			this.imageName.val = file.name;
		},
		async uploadImageLocal() {
			if (!this.imageData) return;

			if (this.imageNameOriginal) await this.deleteImageLocal();

			this.imageName.val = this.imageData.name;
			const file = this.imageData;
			this.isLoading = true;
			try {
				const fileName = `trips/${this.tripId}/${this.imageData.name}`;
				const [downloadURL] = await Promise.all([
					this.uploadStorageObject({ file, path: fileName }),
					this.updateTripImage({ tripId: this.tripId, imageName: this.imageData.name })
				]);
				this.imageUrl = downloadURL;
			} catch (error) {
				this.$loadErrorMessage(this.$options.name, error);
			}

			this.imageData = null;
			this.imagePreview = null;
			this.isLoading = false;
			this.uploadProgressLocal = 0;
		},
		deleteImageCurrent() {
			this.imageName.val = '';
			this.imageUrl = '';
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
		async submitForm() {
			this.validateForm();
			if (!this.formIsValid) return;

			if (!this.imageName.val && this.imageNameOriginal) {
				await this.deleteImageLocal();
			}

			if (this.imageName.val !== this.imageNameOriginal) {
				await this.uploadImageLocal();
			}

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

	.controls {
		display: flex;
		justify-content: flex-start;
	}
</style>