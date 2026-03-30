<template>
	<div class="roadbook-item" :class="{ passed: line.passed === true && passFunctionality === false }" @click="passedLineLocal()">
		<div class="order">{{ line.order }}</div>
		<div class="lat-value">{{ decimalToDMS(line.lat) }}</div>
		<div class="lng-value">{{ decimalToDMS(line.lng, false) }}</div>
		<div class="note" v-html="line.note"></div>
		<div class="check"></div>
	</div>
</template>

<script setup>
import { toRef, computed, onMounted } from "vue";
import { useTripsStore } from "@/stores/trips";
import { useLinesStore } from "@/stores/lines";
import { useRoute } from "vue-router";
import { useQuasar } from "quasar";
import { decimalToDMS, DMSToDecimal } from "@/utils";

const props = defineProps({
	line: {
		type: Object,
		required: true,
		default: () => ({}),
	},
});

// const lat = 18.035144142314884;
// console.log("Decimal START!!!!!!!!!!!!!:", lat);
// const dms = decimalToDMS(lat);
// console.log("DMS!!!!!!!!!!!!!:", dms);
// const decimal = DMSToDecimal(dms);
// console.log("Decimal!!!!!!!!!!!!!:", decimal);

const tripsStore = useTripsStore();
const linesStore = useLinesStore();
const route = useRoute();
const $q = useQuasar();

const isTripViewPrint = computed(() => route.path.includes("trip/view/print"));
const isTripView = computed(() => route.path.includes("trip/view"));
const passFunctionality = computed(() => isTripViewPrint.value || route.path.includes("trip/edit"));

onMounted(() => {
	if (props.line.mapPage && isTripView.value) {
		props.line.mapPage = props.line.mapPage.replace(/,/g, " ");
	}
});

const passedLineLocal = async () => {
	if (passFunctionality.value) return;
	$q.loading.show();
	const passed = !props.line.passed;
	try {
		await linesStore.passedLine(props.line.lineId, passed);
		props.line.passed = passed;
		$q.loading.hide();
	} catch (err) {
		$q.dialog({ title: "Error", message: err.message || err });
		$q.loading.hide();
	}
};

const line = toRef(props, "line");
</script>

<style scoped>
.roadbook-item {
	display: flex;
	grid-template-areas: "order lat-value lng-value note";
	border: 2px solid #111;
	padding: 0;
	margin: 0;
	width: 100%;
	page-break-inside: avoid;
}

.roadbook-item > div {
	border: 1px solid #111;
}

.roadbook-item > div.order {
	flex: 0 0 3%;
	padding: 0.2rem;
	font-weight: bold;
	justify-content: center;
	align-items: center;
}

.roadbook-item > div.lat-value,
.roadbook-item > div.lng-value {
	flex: 0 0 8%;
	padding: 0.2rem;
	font-weight: normal;
	justify-content: center;
	align-items: center;
}

.roadbook-item > div.note {
	flex: 0 0 78%;
	padding: 0.2rem 0.3rem;
	font-weight: normal;
	justify-content: left;
	align-items: flex-start;
}

.roadbook-item > div.check {
	flex: 0 0 78%;
	padding: 0.2rem 0.3rem;
	font-weight: normal;
	justify-content: left;
	align-items: flex-start;
}

.passed {
	background-color: #d3d3d3;
}
</style>
