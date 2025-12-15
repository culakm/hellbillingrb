<template>
    <main>
        <base-dialog @close="clearError" :show="!!error" title="An error is ocurred!">
            <p>{{ error }}</p>
        </base-dialog>
        <section>
            <base-card>
                <div v-if="isLoading">
                    <base-spinner></base-spinner>
                </div>
                <div v-else-if="tripsStore.activeTrip">
                    <h2>{{ tripsStore.activeTrip.name }}</h2>
                    <p>linesCount: {{ tripsStore.activeTrip.linesCount }}</p>
                    <trip-form @save-data="updateTripLocal" :trip="tripsStore.activeTrip"></trip-form>
                </div>
            </base-card>
        </section>
        <section>
            <base-card v-if="tripsStore.activeTripHasLines">
                <ul>
                    <draggable
                        :list="tripsStore.activeTripLines"
                        :disabled="!draggableEnabled"
                        item-key="order"
                        class="list-group"
                        ghost-class="ghost"
                        @start="dragging = true"
                        @end="onEnd"
                    >
                        <template #item="{ element }">
                            <div class="list-group-item" :class="{ 'not-draggable': !draggableEnabled }">
                                <line-actions
                                    :key="element.lineId"
                                    :line="element"
                                    :trip-id="tripsStore.activeTrip.tripId"
                                    @line-is-edited="lineIsEdited"
                                ></line-actions>
                            </div>
                        </template>
                    </draggable>
                </ul>
            </base-card>
        </section>
        <section>
            <base-card>
                <line-form @save-line="createLineLocal"></line-form>
            </base-card>
        </section>
    </main>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useTripsStore } from '@/stores/trips';
import { useLinesStore } from '@/stores/lines';
import { useRoute } from 'vue-router';
import { useError } from '@/composables/useError';
import draggable from "vuedraggable";
import TripForm from '../../components/trips/TripForm.vue';
import LineForm from '../../components/lines/LineForm.vue';
import LineActions from '../../components/lines/LineActions.vue';

export default {
    name: 'TripEdit',
    components: {
        draggable,
        TripForm,
        LineForm,
        LineActions,
    },
    setup() {
        const componentName = 'TripEdit';
        const authStore = useAuthStore();
		const tripsStore = useTripsStore();
		const linesStore = useLinesStore();
        const route = useRoute();
        const { error, setError, clearError } = useError(componentName);

        const isLoading = ref(false);
        const draggableEnabled = ref(true);
        const dragging = ref(false);

        onMounted(() => {
			tripByIdLocal(route.params.tripId);
        });

        async function tripByIdLocal(tripId) {
            isLoading.value = true;
            try {
				await tripsStore.setActiveTrip(tripId);
            } catch (err) {
                setError(err.message || err);
            }
            isLoading.value = false;
        }

        async function updateTripLocal(tripData) {
            isLoading.value = true;
			tripData.userId = authStore.userId;
            try {
				await tripsStore.updateTrip(tripData);
            } catch (err) {
                setError(err.message || err);
            }
            isLoading.value = false;
        }

        async function createLineLocal(lineData) {
            isLoading.value = true;
            const lastOrder = tripsStore.activeTripLines.length;
            lineData.order = lastOrder + 1;
            lineData.tripId = tripsStore.activeTrip.tripId;
            try {
				await linesStore.createLine(lineData);
            } catch (err) {
                setError(err.message || err);
            }
            isLoading.value = false;
        }

        function lineIsEdited() {
            draggableEnabled.value = !draggableEnabled.value;
        }

        async function onEnd(evt) {
            dragging.value = false;
            tripsStore.activeTripLines.forEach((line, index) => {
                line.order = index + 1;
            });
			await linesStore.updateLines(tripsStore.activeTripLines, tripsStore.activeTrip.tripId);
        }

        return {
            componentName,
            error,
            clearError,
            isLoading,
			tripsStore,
            draggableEnabled,
            dragging,
            tripByIdLocal,
            updateTripLocal,
            createLineLocal,
            lineIsEdited,
            onEnd
        };
    }
};
</script>

<style scoped>
    .buttons {
        margin-top: 35px;
    }

    .ghost {
        opacity: 0.5;
        background: #c8ebfb;
    }

    .not-draggable {
        cursor: no-drop;
    }

    ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }
</style>
