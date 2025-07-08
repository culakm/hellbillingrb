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
import { useStore } from 'vuex';
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
        const store = useStore();
        const router = useRouter();
        const { error, setError, clearError } = useError(componentName);

        const isLoading = ref(false);

        async function createTripLocal(tripData) {

            tripData.userId = store.getters.userId;
            isLoading.value = true;
            try {
                await store.dispatch('trips/createTrip', tripData);
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
