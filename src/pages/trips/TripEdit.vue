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
                <div v-else-if="trip">
                    <h2>{{ trip.name }}</h2>
                    <p>linesCount: {{ trip.linesCount }}</p>
                    <trip-form @save-data="updateTripLocal" :trip="trip"></trip-form>
                </div>
            </base-card>
        </section>
        <section>
            <base-card>
                <ul v-if="hasLines">
                    <draggable
                        :list="trip.lines"
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
                                    :trip-id="trip.tripId"
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
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
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
        const store = useStore();
        const route = useRoute();
        const { error, setError, clearError } = useError(componentName);

        const isLoading = ref(false);
        const draggableEnabled = ref(true);
        const dragging = ref(false);
        const tripId = ref(null);

        // Vuex getters
        const trip = computed(() => store.getters['trips/trip']);
        const hasLines = computed(() => store.getters['trips/hasLines']);

        // Fetch trip on mount
        onMounted(() => {
            tripId.value = route.params.tripId;
            tripByIdLocal();
        });

        async function tripByIdLocal() {
            isLoading.value = true;
            try {
                await store.dispatch('trips/tripById', tripId.value);
            } catch (err) {
                setError(err.message || err);
            }
            isLoading.value = false;
        }

        async function updateTripLocal(tripData) {
            isLoading.value = true;
            tripData.linesCount = trip.value.linesCount;
            try {
                await store.dispatch('trips/updateTrip', tripData);
            } catch (err) {
                setError(err.message || err);
            }
            isLoading.value = false;
        }

        async function createLineLocal(lineData) {
            isLoading.value = true;
            const lastOrder = trip.value.lines.length;
            lineData.order = lastOrder + 1;
            lineData.tripId = trip.value.tripId;
            try {
                await store.dispatch('trips/createLine', lineData);
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
            trip.value.lines.forEach((line, index) => {
                line.order = index + 1;
            });
            await store.dispatch('trips/updateLines', { lines: trip.value.lines, tripId: trip.value.tripId });
        }

        return {
            componentName,
            error,
            clearError,
            isLoading,
            draggableEnabled,
            dragging,
            trip,
            hasLines,
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
