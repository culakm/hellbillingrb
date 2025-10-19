<template>
    <main>
        <base-dialog @close="clearError" :show="!!error" title="An error is ocurred!">
            <p>{{ error }}</p>
        </base-dialog>
        <section>
            <base-card>
                <h2>Add Trip.</h2>
                <div v-if="isLoading">
                    <base-spinner></base-spinner>
                </div>
                <trip-form @save-data="createTripLocal"></trip-form>
            </base-card>
        </section>
    </main>
</template>

<script>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useTripsStore } from '@/stores/trips';
import { useRouter } from 'vue-router';
import { useError } from '@/composables/useError';
import TripForm from '../../components/trips/TripForm.vue';

export default {
    name: 'TripCreate',
    components: {
        TripForm,
    },
    setup() {
        const componentName = 'TripCreate';
        const authStore = useAuthStore();
		const tripsStore = useTripsStore();
        const router = useRouter();
        const { error, setError, clearError } = useError(componentName);

        const isLoading = ref(false);

        async function createTripLocal(tripData) {

            tripData.userId = authStore.userId;
            isLoading.value = true;
            try {
				await tripsStore.createTrip(tripData);
            } catch (err) {
                setError(err.message || err);
                isLoading.value = false;
                return;
            }
            isLoading.value = false;
            router.replace('/trips');
        }

        return {
            componentName,
            error,
            clearError,
            isLoading,
            createTripLocal
        };
    }
};
</script>
