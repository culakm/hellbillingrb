<template>
	<main>
		<div data-html2canvas-ignore>
			<button @click="exportToPDF">Export to PDF</button>
			<label>
				<input type="checkbox" v-model="printHeader" />
				Print Header
			</label>
		</div>
		<base-dialog @close="handleError" :show="!!error" title="An error is ocurred!">
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
import { errorMixin } from '@/mixins/errorMixin';
import { mapGetters, mapActions } from 'vuex';
import TripFull from '../../components/trips/TripFull.vue';
import LineView from '../../components/lines/LineView.vue';
import html2pdf from "html2pdf.js";
export default {
	name: 'TripView',
	mixins: [errorMixin],
	components: {
		TripFull,
		LineView,
	},
	data() {
		return {
			isLoading: false,
			error: null,
			tripId: null,
			printHeader: true,
		};
	},
	computed: {
		...mapGetters('trips', ['trip', 'hasLines']),
		isEvery7th() {
			return (index) => (index + 1) % 7 === 0;
		},
		isEvery7thPlus1() {
			return (index) => index > 0 && (index + 1) % 7 === 1;
		},
		tripNamePrint() {
			return this.trip.name.replace(/ /g, '_').toLowerCase();
		},
	},
	async created() {
		this.tripId = this.$route.params.tripId;
		await this.tripByIdLocal(); // tu je await aby sa setLinesPassedFalse() urobila az potom
		this.setLinesPassedFalse();
	},
	methods: {
		...mapActions('trips', ['tripById']),
		async tripByIdLocal() {
			this.isLoading = true;
			try {
				await this.tripById(this.tripId);
			} catch (error) {
				this.$loadErrorMessage(this.$options.name, error);
			}
			this.isLoading = false;
		},
		setLinesPassedFalse() {
			this.trip.lines.forEach(line => {
				line.passed = false;
			});
		},
		exportToPDF() {
			const element = document.getElementById('element-to-pdf');
			const opt = {
				// margin: [0, 0, 0, 0], // Set all margins to 0
				margin: 10,
				filename: 'hbrb_' + this.tripNamePrint + '.pdf',
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
		},
	},
};
</script>

<style scoped>
	@media print {
		@page {
			margin: 10px;
			/* Remove all margins */
			size: auto;
			/* Use the full page size */
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
		/* page-break-inside: avoid; */
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