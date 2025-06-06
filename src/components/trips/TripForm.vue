<template>
    <base-dialog @close="clearError" :show="!!error" title="An error is ocurred!">
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
            <base-button link newTab :to="tripPrintLink">Print</base-button>
        </div>
    </form>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useError } from '@/composables/useError';

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
    setup(props, { emit }) {
        const componentName = 'TripForm';
        const store = useStore();
        const { error, setError, clearError } = useError(componentName);

        // Form fields
        const name = ref({ val: '', isValid: true });
        const description = ref({ val: '', isValid: true });
        const imageName = ref({ val: '', isValid: true });
        const tripId = ref('');
        const isLoading = ref(false);
        const formIsValid = ref(true);
        const imageUrl = ref('');
        const imageData = ref(null);
        const imagePreview = ref(null);
        const imageNameOriginal = ref('');

        // Upload progress (getter/setter via computed)
        const uploadProgressLocal = computed({
            get: () => store.getters['tripsStorage/uploadProgress'],
            set: (val) => store.commit('tripsStorage/setUploadProgress', val)
        });

        // Computed for image source
        const imageSrc = computed(() => imagePreview.value ? imagePreview.value : imageUrl.value);

        // View/Print links
        const tripViewLink = computed(() => `/trip/view/${tripId.value}`);
        const tripPrintLink = computed(() => `/trip/view/print/${tripId.value}`);

        // Initialize form fields
        onMounted(async () => {
            if (props.trip.tripId) {
                tripId.value = props.trip.tripId;
            } else {
                await setTripId();
            }
            name.value.val = props.trip.name || '';
            description.value.val = props.trip.description || '';
            imageName.value.val = props.trip.imageName || '';
            if (imageName.value.val) {
                await fetchImageUrlLocal();
                imageNameOriginal.value = imageName.value.val;
            }
        });

        // Store actions
        async function setTripId() {
            try {
                tripId.value = await store.dispatch('trips/getTripNewId');
            } catch (err) {
                setError(err.message || err);
            }
        }

        async function fetchImageUrlLocal() {
            const tripData = {
                tripId: props.trip.tripId,
                imageName: props.trip.imageName,
            };
            try {
                imageUrl.value = await store.dispatch('tripsStorage/fetchImageUrl', tripData);
            } catch (err) {
                setError(err.message || err);
            }
        }

        async function deleteImageLocal() {
            const tripData = {
                tripId: props.trip.tripId,
                imageName: props.trip.imageName,
            };
            try {
                await Promise.all([
                    store.dispatch('tripsStorage/deleteStorageObject', tripData),
                    store.dispatch('trips/deleteTripImage', tripData)
                ]);
            } catch (err) {
                setError(err.message || err);
            }
        }

        function previewImage(event) {
            const file = event.target.files[0];
            if (!file) return;
            imageData.value = file;
            imagePreview.value = URL.createObjectURL(file);
            uploadProgressLocal.value = 0;
            imageName.value.val = file.name;
        }

        async function uploadImageLocal() {
            if (!imageData.value) return;

            if (imageNameOriginal.value) await deleteImageLocal();

            imageName.value.val = imageData.value.name;
            const file = imageData.value;
            isLoading.value = true;
            try {
                const fileName = `trips/${tripId.value}/${imageData.value.name}`;
                const [downloadURL] = await Promise.all([
                    store.dispatch('tripsStorage/uploadStorageObject', { file, path: fileName }),
                    store.dispatch('trips/updateTripImage', { tripId: tripId.value, imageName: imageData.value.name })
                ]);
                imageUrl.value = downloadURL;
            } catch (err) {
                setError(err.message || err);
            }

            imageData.value = null;
            imagePreview.value = null;
            isLoading.value = false;
            uploadProgressLocal.value = 0;
        }

        function deleteImageCurrent() {
            imageName.value.val = '';
            imageUrl.value = '';
        }

        function clearValidity(input) {
            if (input === 'name') name.value.isValid = true;
            if (input === 'description') description.value.isValid = true;
            if (input === 'imageName') imageName.value.isValid = true;
        }

        function validateForm() {
            formIsValid.value = true;
            if (name.value.val === '') {
                name.value.isValid = false;
                formIsValid.value = false;
            }
            // Add other validations if needed
        }

        async function submitForm() {
            validateForm();
            if (!formIsValid.value) return;

            if (!imageName.value.val && imageNameOriginal.value) {
                await deleteImageLocal();
            }

            if (imageName.value.val !== imageNameOriginal.value) {
                await uploadImageLocal();
            }

            const tripData = {
                tripId: tripId.value,
                name: name.value.val,
                description: description.value.val,
                imageName: imageName.value.val,
            };
            emit('save-data', tripData);
        }

        return {
            componentName,
            error,
            clearError,
            name,
            description,
            imageName,
            tripId,
            isLoading,
            formIsValid,
            imageUrl,
            imageData,
            imagePreview,
            imageNameOriginal,
            uploadProgressLocal,
            imageSrc,
            tripViewLink,
            tripPrintLink,
            trip: props.trip,
            setTripId,
            fetchImageUrlLocal,
            deleteImageLocal,
            previewImage,
            uploadImageLocal,
            deleteImageCurrent,
            clearValidity,
            validateForm,
            submitForm
        };
    }
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
