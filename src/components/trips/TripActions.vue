<template>
    <base-dialog @close="clearError" :show="!!error" title="An error is ocurred!">
        <p>{{ error }}</p>
    </base-dialog>
    <li>
        <div class="header">
            <h3>{{ name }}</h3>
            <p>{{ description }}</p>
        </div>
        <div v-if="isLoading">
            <base-spinner></base-spinner>
        </div>
        <div v-else class="actions">
            <base-button link :to="tripViewLink">View</base-button>
            <base-button link :to="tripEditLink">Edit</base-button>
            <div class="print-button"><base-button link newTab :to="tripPrintLink">Print</base-button></div>
            <base-button @click="deleteTripLocal">Delete</base-button>
        </div>
    </li>
</template>

<script>
import { ref, toRef, computed } from 'vue';
import { useTripsStore } from '@/stores/trips';
import { useRouter } from 'vue-router';
import { useError } from '@/composables/useError';

export default {
    name: 'TripActions',
    props: {
        tripId: {
            type: [String, Number],
            required: true
        },
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: false,
            default: ''
        }
    },
    setup(props) {
        const componentName = 'TripActions';
		const tripsStore = useTripsStore();
        const router = useRouter();
        const { error, setError, clearError } = useError(componentName);

        const isLoading = ref(false);

        const tripViewLink = computed(() => `/trip/view/${props.tripId}`);
        const tripPrintLink = computed(() => `/trip/view/print/${props.tripId}`);
        const tripEditLink = computed(() => `/trip/edit/${props.tripId}`);

        async function deleteTripLocal() {
            const confirmed = confirm('Are you sure you want to delete this trip?');
            if (!confirmed) { return; }
            isLoading.value = true;
            try {
				await tripsStore.deleteTrip(props.tripId);
            } catch (err) {
                setError(err.message || err);
            }
            isLoading.value = false;
            router.replace('/trips');
        }

        return {
            componentName,
            error,
            clearError,
            isLoading,
            // name: props.name,
			line: toRef(props, 'name'),
            // description: props.description,
			line: toRef(props, 'description'),
            tripViewLink,
            tripPrintLink,
            tripEditLink,
            deleteTripLocal
        };
    }
};
</script>

<style scoped>
    @media (max-width: 46rem) {
        .print-button {
            display: none;
        }
    }

    @media (min-width: 46rem) {
        .print-button {
            display: inherit;
        }
    }

    li {
        margin: 1rem 0;
        border: 1px solid #424242;
        border-radius: 12px;
        padding: 1rem;
    }

    .header {
        display: flex;
        align-items: center;
    }

    .header h3,
    .header p {
        margin-right: 10px;
        /* Adjust spacing between h3 and p */
    }

    .actions {
        display: flex;
        justify-content: flex-start;
        /* Adjust spacing between the header and actions */
    }
</style>
