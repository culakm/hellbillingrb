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
import { ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
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
        const store = useStore();
        const { error, setError, clearError } = useError(componentName);

        const imageUrl = ref('');

        // Fetch image URL if imageName exists
        const fetchImageUrlLocal = async () => {
            if (!props.trip.imageName) return;
            const tripData = {
                tripId: props.trip.tripId,
                imageName: props.trip.imageName,
            };
            try {
                imageUrl.value = await store.dispatch('tripsStorage/fetchImageUrl', tripData);
            } catch (err) {
                setError(err.message || err);
            }
        };

        // Fetch image on mount and when trip.imageName changes
        onMounted(fetchImageUrlLocal);
        watch(() => props.trip.imageName, fetchImageUrlLocal);

        return {
            componentName,
            error,
            clearError,
            imageUrl,
            trip: props.trip
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
