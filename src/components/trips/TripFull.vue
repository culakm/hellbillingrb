<template>
    <base-dialog @close="clearError" :show="!!error" title="An error is ocurred!">
        <p>{{ error }}</p>
    </base-dialog>
    <div class="trip-full">
        <h3>{{ trip.name }}</h3>
        <p>{{ trip.description }}</p>
        <p>Lines: {{ trip.linesCount }}</p>
        <img v-if="trip.imageName" :src="imageUrl" alt="Downloaded">
    </div>
</template>

<script>
import { ref, toRef, onMounted, watch } from 'vue';
import { useFirebaseStorage } from '@/composables/useFirebaseStorage';
import { useError } from '@/composables/useError';

export default {
    name: 'TripFull',
    props: {
        trip: {
            type: Object,
            required: false,
            default: () => ({}),
        },
    },
    setup(props) {
        const componentName = 'TripFull';
        const { error, setError, clearError } = useError(componentName);

        const imageUrl = ref('');

        const fetchImageUrlLocal = async () => {
            if (!props.trip.imageName) return;
			console.log('Trip data:', props.trip);
			console.log('props.trip.imageName', props.trip.imageName);

			console.log('props.trip.tripId:', props.trip.tripId);
            try {
				const { fetchImageUrl } = useFirebaseStorage();
                imageUrl.value = await fetchImageUrl(props.trip.imageName, props.trip.tripId);
            } catch (err) {
                setError(err.message || err);
            }
        };

        onMounted(fetchImageUrlLocal);
        watch(() => props.trip.imageName, fetchImageUrlLocal);

        return {
            componentName,
            error,
            clearError,
            imageUrl,
			trip: toRef(props, 'trip'),
        };
    }
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
