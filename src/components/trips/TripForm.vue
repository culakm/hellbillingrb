<template>
	<q-card-section
		class="bg-primary text-white flex items-center q-mb-md rounded-borders full-width"
	>
		<q-icon name="directions_car" size="32px" class="q-mr-sm" />
		<div class="text-h5">{{ formTitle }}</div>
		<div
			v-if="ownerLabel"
			class="text-caption text-italic q-ml-auto"
		>
			Owner: {{ ownerLabel }}
		</div>
	</q-card-section>
	<q-form class="q-mb-md full-width" @submit.prevent="submitForm">
		<div class="row q-col-gutter-md items-start">
			<div class="col-6">
				<q-input
					v-model="name"
					filled
					label="Trip Name"
					:rules="[required]"
					autocomplete="off"
				/>
			</div>
			<div class="col-6">
				<q-input
					v-model="description"
					filled
					label="Description"
					type="textarea"
					autogrow
				/>
			</div>
			<div class="col-12">
				<q-file
					v-model="imageFile"
					filled
					label="Trip Image"
					accept="image/*"
					counter
					:loading="uploadProgressFlag"
					@update:model-value="previewImage"
				>
					<template #prepend>
						<q-icon name="attach_file" />
					</template>
				</q-file>
				<div class="q-mt-sm">
					<q-banner
						v-if="!imageSrc"
						class="bg-grey-2 text-grey-7 q-pa-sm rounded-borders"
						dense
					>
						<q-icon name="image_not_supported" class="q-mr-sm" />
						No image selected
					</q-banner>
					<div v-else class="column items-center">
						<q-img
							:src="imageSrc"
							alt="trip image"
							style="
								max-width: 100%;
								max-height: 200px;
								border-radius: 8px;
								box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
							"
							fit="contain"
						/>
						<q-btn
							class="q-mt-sm"
							color="negative"
							icon="delete"
							label="Delete Image"
							@click.prevent="deleteImageCurrent"
						/>
					</div>
				</div>
			</div>
		</div>
		<div class="row q-gutter-sm justify-end q-mt-md">
			<q-btn
				v-if="!trip || !trip.tripId"
				color="primary"
				label="Add Trip"
				type="submit"
			/>
			<q-btn v-else color="primary" label="Save Trip" type="submit" />
			<q-btn v-if="tripId" color="secondary" label="View" :to="tripViewLink" />
		</div>
	</q-form>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useTripsStore } from '@/stores/trips';
import { useUsersStore } from '@/stores/users';
import {
	uploadProgress,
	fetchFileUrl,
	uploadStorageObject,
	deleteStorageObject,
} from '@/composables/useFirebaseStorage';
import { useQuasar } from 'quasar';
import { required } from '@/composables/useFormValidationRules';

const props = defineProps({
	trip: {
		type: Object,
		required: false,
		default: () => ({}),
	},
});
const emit = defineEmits(['save-data']);

const authStore = useAuthStore();
const tripsStore = useTripsStore();
const usersStore = useUsersStore();
const $q = useQuasar();

const ownerLabel = computed(() =>
	usersStore.labelForOwner(props.trip?.userId, authStore.userId)
);

// Form fields
const name = ref('');
const description = ref('');
const imageName = ref('');
const tripId = ref(null);

const imageUrl = ref('');
const imageData = ref(null);
const imagePreview = ref(null);
const imageNameOriginal = ref('');

const imageFile = ref(null);

const kmTotal = computed(() => {
	const lines = props.trip.lines;
	if (!Array.isArray(lines) || lines.length === 0) return 0;
	const lastLine = lines[lines.length - 1];
	return lastLine?.kmTotal ?? 0;
});

const imageSrc = computed(() =>
	imagePreview.value ? imagePreview.value : imageUrl.value
);
const formTitle = computed(() => {
	if (tripId.value) {
		return (
			name.value +
			' ' +
			(props.trip.linesCount ?? 0) +
			' lines, ' +
			kmTotal.value +
			' km'
		);
	} else {
		return 'Create Trip';
	}
});

const uploadProgressFlag = computed(() => {
	const val = Number(uploadProgress.value);
	return val > 0 && val < 100;
});

const tripViewLink = computed(() =>
	tripId.value ? `/trip/view/${tripId.value}` : ''
);

const fetchImageUrlLocal = async () => {
	const path = `trips/${tripId.value}/${props.trip.imageName}`;
	try {
		imageUrl.value = await fetchFileUrl(props.trip.imageName, path);
	} catch (err) {
		$q.dialog({ title: 'Error', message: err.message || err });
	}
};

const deleteImageLocal = async () => {
	const path = `trips/${tripId.value}/${props.trip.imageName}`;
	try {
		await Promise.all([
			tripsStore.deleteTripImage(tripId.value, props.trip.imageName),
			deleteStorageObject(props.trip.imageName, path),
		]);
	} catch (err) {
		$q.dialog({ title: 'Error', message: err.message || err });
	}
};

const syncFromProps = async () => {
	name.value = props.trip.name || '';
	description.value = props.trip.description || '';
	imageName.value = props.trip.imageName || '';
	tripId.value = props.trip.tripId || null;
	imageData.value = null;
	imagePreview.value = null;
	imageUrl.value = '';
	imageNameOriginal.value = '';
	imageFile.value = null;
	if (!tripId.value) {
		tripId.value = await tripsStore.getNewTripId();
	}
	if (imageName.value) {
		await fetchImageUrlLocal();
		imageNameOriginal.value = imageName.value;
	}
};

watch(() => props.trip, syncFromProps, { immediate: true });

const previewImage = (input) => {
	let file;
	if (input && input.target && input.target.files) {
		// Native input element event.target.files
		file = input.target.files[0];
	} else if (Array.isArray(input)) {
		file = input[0];
	} else {
		file = input;
	}
	if (!file) return;
	imageData.value = file;
	imagePreview.value = URL.createObjectURL(file);
	uploadProgress.value = 0;
	imageName.value = file.name;
};

const uploadImageLocal = async () => {
	if (!imageData.value) return;
	if (imageNameOriginal.value) await deleteImageLocal();
	imageName.value = imageData.value.name;
	const file = imageData.value;
	$q.loading.show();
	try {
		const path = `trips/${tripId.value}/${imageData.value.name}`;
		const [downloadURL] = await Promise.all([
			await uploadStorageObject(file, path),
			tripsStore.updateTripImage(tripId.value, imageData.value.name),
		]);
		imageUrl.value = downloadURL;
		$q.loading.hide();
	} catch (err) {
		$q.loading.hide();
		$q.dialog({ title: 'Error', message: err.message || err });
	}
	imageData.value = null;
	imagePreview.value = null;
	uploadProgress.value = 0;
};

const deleteImageCurrent = () => {
	imageName.value = '';
	imageUrl.value = '';
	imagePreview.value = null;
	imageData.value = null;
	imageFile.value = null;
};

const submitForm = async () => {
	if (!imageName.value && imageNameOriginal.value) {
		await deleteImageLocal();
	}
	if (imageName.value !== imageNameOriginal.value) {
		await uploadImageLocal();
	}
	const tripData = {
		tripId: tripId.value,
		name: name.value,
		description: description.value,
		imageName: imageName.value,
	};
	emit('save-data', tripData);
};
</script>
