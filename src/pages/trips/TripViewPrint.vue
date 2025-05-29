<template>
    <main>
        <div data-html2canvas-ignore>
            <button @click="exportToPDF">Export to PDF</button>
            <label>
                <input type="checkbox" v-model="printHeader" />
                Print Header
            </label>
        </div>
        <base-dialog @close="clearError" :show="!!error" title="An error is ocurred!">
            <p>{{ error }}</p>
        </base-dialog>
        <div v-if="isLoading">
            <base-spinner></base-spinner>
        </div>
        <div v-else :id="printHeader ? 'element-to-pdf' : null" :class="{ 'print-area': printHeader }">
            <div class="roadbook-header pagebreak-after">
                <trip-full v-if="trip" :trip="trip"></trip-full>
            </div>
            <div v-if="hasLines" :id="printHeader ? null : 'element-to-pdf'" class="roadbook"
                :class="{ 'print-area': !printHeader }">
                <template v-for="(line, index) in trip.lines" :key="line.lineId">
                    <div class="roadbook-item-wrap"
                        :class="{ 'pagebreak-after': isEvery7th(index), 'offset': isEvery7thPlus1(index) }">
                        <line-view :line="line"></line-view>
                    </div>
                </template>
            </div>
        </div>
    </main>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { useError } from '@/composables/useError';
import TripFull from '../../components/trips/TripFull.vue';
import LineView from '../../components/lines/LineView.vue';
import html2pdf from "html2pdf.js";

export default {
    name: 'TripViewPrint',
    components: {
        TripFull,
        LineView,
    },
    setup() {
        const componentName = 'TripViewPrint';
        const store = useStore();
        const route = useRoute();
        const { error, setError, clearError } = useError(componentName);

        const isLoading = ref(false);
        const tripId = ref(null);
        const printHeader = ref(true);

        // Vuex getters
        const trip = computed(() => store.getters['trips/trip']);
        const hasLines = computed(() => store.getters['trips/hasLines']);

        // Computed for template logic
        const isEvery7th = (index) => (index + 1) % 7 === 0;
        const isEvery7thPlus1 = (index) => index > 0 && (index + 1) % 7 === 1;
        const tripNamePrint = computed(() =>
            trip.value && trip.value.name
                ? trip.value.name.replace(/ /g, '_').toLowerCase()
                : 'trip'
        );

        // Fetch trip data on mount
        onMounted(async () => {
            tripId.value = route.params.tripId;
            await tripByIdLocal();
            setLinesPassedFalse();
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

        function setLinesPassedFalse() {
            if (trip.value && trip.value.lines) {
                trip.value.lines.forEach(line => {
                    line.passed = false;
                });
            }
        }

        function exportToPDF() {
            const element = document.getElementById('element-to-pdf');
            const opt = {
                margin: 10,
                filename: 'hbrb_' + tripNamePrint.value + '.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { format: 'letter', orientation: 'portrait' },
                pagebreak: {
                    mode: ['avoid-all', 'css'],
                    before: '.pagebreak-before',
                    after: '.pagebreak-after',
                },
            };
            html2pdf().set(opt).from(element).save();
        }

        return {
            componentName,
            error,
            clearError,
            isLoading,
            printHeader,
            trip,
            hasLines,
            isEvery7th,
            isEvery7thPlus1,
            exportToPDF
        };
    }
};
</script>

<style scoped>
    @media print {
        @page {
            margin: 10px;
            size: auto;
        }

        [data-html2canvas-ignore] {
            display: none !important;
        }

        body button {
            display: none;
        }

        .offset {
            display: none;
        }

        .firebase-emulator-warning {
            display: none;
        }

        .roadbook-header {
            width: 100%;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            break-after: page;
        }

        .roadbook {
            width: 100%;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        .roadbook-item-wrap {
            width: 100%;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 0;
        }
    }

    .roadbook-item-wrap {
        width: 100%;
    }

    .offset {
        margin-top: 1rem;
    }

    .print-area {
        font-family: "Montserrat", sans-serif !important;
        width: 100%;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
</style>
