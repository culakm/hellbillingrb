<template>
	<q-card class="q-pa-md shadow-2 rounded-borders" style="width: 100%; margin: auto">
		<q-card-section class="bg-primary text-white flex items-center q-mb-md rounded-borders">
			<q-icon name="directions_car" size="32px" class="q-mr-sm" />
			<div class="text-h5">{{ formTitle }}</div>
		</q-card-section>
		<q-separator />
		<q-form @submit.prevent="submitForm" class="q-gutter-md">
			<div class="row q-col-gutter-md items-start">
				<div class="col-6">
					<q-input filled v-model="name" label="Trip Name" :rules="[required]" autocomplete="off" />
				</div>
				<div class="col-6">
					<q-input filled v-model="description" label="Description" type="textarea" autogrow />
				</div>
				<div class="col-12">
					<q-file filled v-model="imageFile" label="Trip Image" @update:model-value="previewImage" accept="image/*" counter :loading="uploadProgressFlag">
						<template v-slot:prepend>
							<q-icon name="attach_file" />
						</template>
					</q-file>
					<div class="q-mt-sm">
						<q-banner v-if="!imageSrc" class="bg-grey-2 text-grey-7 q-pa-sm rounded-borders" dense>
							<q-icon name="image_not_supported" class="q-mr-sm" />
							No image selected
						</q-banner>
						<div v-else class="column items-center">
							<q-img :src="imageSrc" alt="trip image" style="max-width: 100%; max-height: 200px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08)" fit="contain" />
							<q-btn class="q-mt-sm" color="negative" icon="delete" label="Delete Image" @click.prevent="deleteImageCurrent" />
						</div>
					</div>
				</div>
			</div>
			<div class="row q-gutter-sm justify-end q-mt-md">
				<q-btn v-if="!trip || !trip.tripId" color="primary" label="Add Trip" type="submit" />
				<q-btn v-else color="primary" label="Save Trip" type="submit" />
				<q-btn v-if="tripId" color="secondary" label="View" :to="tripViewLink" />
				<q-btn v-if="tripId" color="secondary" label="Print" :to="tripPrintLink" target="_blank" />
			</div>
		</q-form>
	</q-card>
</template>

<script setup>
import { ref, computed, onMounted, defineProps, defineEmits, watch } from "vue";
import { useTripsStore } from "@/stores/trips";
import { uploadProgress, fetchFileUrl, uploadStorageObject, deleteStorageObject } from "@/composables/useFirebaseStorage";
import { useQuasar } from "quasar";
import { required } from "@/composables/useFormValidationRules";

const props = defineProps({
	trip: {
		type: Object,
		required: false,
		default: () => ({}),
	},
});
const emit = defineEmits(["save-data"]);

const tripsStore = useTripsStore();
const $q = useQuasar();

// Form fields
const name = ref(props.trip.name || "");
const description = ref(props.trip.description || "");
const imageName = ref("");

const imageUrl = ref("");
const imageData = ref(null);
const imagePreview = ref(null);
const imageNameOriginal = ref("");

const imageFile = ref(null);

const imageSrc = computed(() => (imagePreview.value ? imagePreview.value : imageUrl.value));
let tripId = props.trip.tripId || null;
const formTitle = computed(() => {
	if (tripId) {
		return "Edit Trip: " + name.value + " Lines Count: " + (tripsStore.activeTrip.linesCount ?? 0);
	} else {
		return "Create Trip";
	}
});

const uploadProgressFlag = computed(() => {
	const val = Number(uploadProgress.value);
	return val > 0 && val < 100;
});

const tripViewLink = computed(() => (tripId ? `/trip/view/${tripId}` : ""));
const tripPrintLink = computed(() => (tripId ? `/trip/view/print/${tripId}` : ""));

onMounted(async () => {
	if (!tripId) {
		tripId = await tripsStore.getNewTripId();
	}
	name.value = props.trip.name || "";
	description.value = props.trip.description || "";
	imageName.value = props.trip.imageName || "";
	if (imageName.value) {
		await fetchImageUrlLocal();
		imageNameOriginal.value = imageName.value;
	}
});

const fetchImageUrlLocal = async () => {
	const path = `trips/${tripId}/${props.trip.imageName}`;
	try {
		imageUrl.value = await fetchFileUrl(props.trip.imageName, path);
	} catch (err) {
		$q.dialog({ title: "Error", message: err.message || err });
	}
};

const deleteImageLocal = async () => {
	const path = `trips/${tripId}/${props.trip.imageName}`;
	try {
		await Promise.all([tripsStore.deleteTripImage(tripId, props.trip.imageName), deleteStorageObject(props.trip.imageName, path)]);
	} catch (err) {
		$q.dialog({ title: "Error", message: err.message || err });
	}
};

const previewImage = (input) => {
	let file = null;
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
		const path = `trips/${tripId}/${imageData.value.name}`;
		const [downloadURL] = await Promise.all([await uploadStorageObject(file, path), tripsStore.updateTripImage(tripId, imageData.value.name)]);
		imageUrl.value = downloadURL;
		$q.loading.hide();
	} catch (err) {
		$q.loading.hide();
		$q.dialog({ title: "Error", message: err.message || err });
	}
	imageData.value = null;
	imagePreview.value = null;
	uploadProgress.value = 0;
};

const deleteImageCurrent = () => {
	imageName.value = "";
	imageUrl.value = "";
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
		tripId: tripId,
		name: name.value,
		description: description.value,
		imageName: imageName.value,
	};
	emit("save-data", tripData);
};
</script>
