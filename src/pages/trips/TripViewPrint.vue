<template>
	<main>
		<div data-html2canvas-ignore class="row items-center q-gutter-md q-mb-md">
			<q-btn color="primary" icon="picture_as_pdf" label="Export to PDF" @click="exportToPDF" />
			<q-toggle v-model="printHeader" label="Print Header" color="primary" />
		</div>

		<div :id="printHeader ? 'element-to-pdf' : null" :class="{ 'print-area': printHeader }">
			<div class="roadbook-header pagebreak-after">
				<trip-full v-if="tripsStore.activeTrip" :trip="tripsStore.activeTrip"></trip-full>
			</div>
			<div v-if="tripsStore.activeTrip.hasLines" :id="printHeader ? null : 'element-to-pdf'" class="roadbook" :class="{ 'print-area': !printHeader }">
				<template v-for="(line, index) in tripsStore.activeTrip.lines" :key="line.lineId">
					<div class="roadbook-item-wrap" :class="{ 'pagebreak-after': isEvery7th(index), offset: isEvery7thPlus1(index) }">
						<line-view :line="line"></line-view>
					</div>
				</template>
			</div>
		</div>
	</main>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useTripsStore } from "@/stores/trips";
import { useRoute } from "vue-router";
import { useQuasar } from "quasar";
import TripFull from "@/components/trips/TripFull.vue";
import LineView from "@/components/lines/LineView.vue";
import html2pdf from "html2pdf.js";

const tripsStore = useTripsStore();
const route = useRoute();
const $q = useQuasar();

const printHeader = ref(true);

const isEvery7th = (index) => (index + 1) % 7 === 0;
const isEvery7thPlus1 = (index) => index > 0 && (index + 1) % 7 === 1;
const tripNamePrint = computed(() => (tripsStore.activeTrip.value && tripsStore.activeTrip.value.name ? tripsStore.activeTrip.value.name.replace(/ /g, "_").toLowerCase() : "trip"));

const tripByIdLocal = async (tripId) => {
	$q.loading.show();
	try {
		await tripsStore.setActiveTrip(tripId);
		$q.loading.hide();
	} catch (err) {
		$q.loading.hide();
		$q.dialog({ title: "Error", message: err.message || err });
	}
};

const exportToPDF = () => {
	const element = document.getElementById("element-to-pdf");
	const opt = {
		margin: 10,
		filename: "hbrb_" + tripNamePrint.value + ".pdf",
		image: { type: "jpeg", quality: 0.98 },
		html2canvas: { scale: 2, useCORS: true },
		jsPDF: { format: "letter", orientation: "portrait" },
		pagebreak: {
			mode: ["avoid-all", "css"],
			before: ".pagebreak-before",
			after: ".pagebreak-after",
		},
	};
	html2pdf().set(opt).from(element).save();
};

onMounted(async () => {
	await tripByIdLocal(route.params.tripId);
});
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
