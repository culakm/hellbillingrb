<template>
	<div class="roadbook-item" :class="{ passed: line.passed === true && passFunctionality === false }" @click="passedLineLocal()">
		<div class="roadbook-item-latlng">
			<div class="lat-label">Lat</div>
			<div class="lat-value">{{ decimalToDMS(line.lat) }}</div>
			<div class="lng-label">Lng</div>
			<div class="lng-value">{{ decimalToDMS(line.lng, false) }}</div>
		</div>
		<div class="roadbook-item-place">
			<div class="order">{{ line.order }}</div>
			<div class="point">
				<div class="point-grid">
					<div class="name" v-html="line.name"></div>
					<div class="tags">
						<div v-if="line.stop" class="stop">
							<div class="svgicon" :class="{ 'color-stop': !isTripViewPrint }">
								<img src="/img/interest_stop_transparent.svg" alt="stop" />
							</div>
						</div>
						<div class="interest">
							<div v-if="line.culture" class="svgicon" :class="{ 'color-culture': !isTripViewPrint }">
								<img src="/img/interest_c_transparent.svg" alt="culture" />
							</div>
							<div v-if="line.history" class="svgicon" :class="{ 'color-history': !isTripViewPrint }">
								<img src="/img/interest_h_transparent.svg" alt="history" />
							</div>
							<div v-if="line.sport" class="svgicon" :class="{ 'color-sport': !isTripViewPrint }">
								<img src="/img/interest_s_transparent.svg" alt="sport" />
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="map-page">
				<div class="map-page-label">Map Page</div>
				<div class="map-page-value">{{ line.mapPage }}</div>
			</div>
			<div class="distance">
				<div class="km-total">
					{{ typeof line.kmTotal === "number" && line.kmTotal >= 0 ? line.kmTotal + " Km" : "--" }}
				</div>
				<div class="km-start-end">
					{{ line.order === 1 ? "DSS" : line.order === tripsStore.activeTrip.linesCount ? "ASS" : "" }}
				</div>
				<div class="km-part">{{ line.kmPart > 0 ? line.kmPart + " Km" : "--" }}</div>
			</div>
		</div>
		<div class="roadbook-item-road">
			<div class="tulip" :class="{ 'show-before': line.close, 'color-tulip': !isTripViewPrint }">
				<img class="tulip-img" v-if="line.tulip" :src="tulipSrc(line.tulip)" alt="tulip" />
			</div>
			<div class="road-no">
				<div class="road-no-label">Road No.</div>
				<div class="road-no-value">{{ line.roadNo }}</div>
			</div>
			<div class="note" v-html="line.note"></div>
		</div>
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

const tulipSrc = (tulip) => `/img/${tulip}.svg`;

const line = toRef(props, "line");
</script>

<style scoped>
.roadbook-item {
	display: grid;
	grid-template-areas:
		"latlng"
		"place"
		"road";
	border: 2px solid #111;
	padding: 0;
	margin: 0;
	width: 100%;
	page-break-inside: avoid;
}

.roadbook-item-latlng {
	height: 2.5rem;
	grid-area: latlng;
	border: #000 1px solid;
	display: flex;
	flex-wrap: nowrap;
	justify-content: space-between;
	align-items: stretch;
}

.roadbook-item-place {
	height: 4rem;
	grid-area: place;
	border: #000 1px solid;
	display: flex;
	flex-wrap: nowrap;
	justify-content: space-between;
	align-items: stretch;
}

.roadbook-item-place > div {
	border: #000 1px solid;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: bold;
}

.roadbook-item-place > div.order {
	/* flex-grow: 0; flex-shrink: 0; flex-basis: 5%; */
	flex: 0 0 5%;
}

.roadbook-item-place > div.point {
	flex: 0 0 55%;
}

.roadbook-item-place > div.point .point-grid {
	width: 100%;
	height: 100%;
	display: grid;
	grid-template-areas:
		"name"
		"tags";
}

.roadbook-item-place > div.point .point-grid .name {
	margin: 0 1rem;
	grid-area: name;
	justify-self: left;
	align-self: center;
}

.roadbook-item-place > div.point .point-grid .tags {
	margin: 0 1rem;
	grid-area: tags;
	justify-self: left;
	align-self: center;
	display: flex;
}

.roadbook-item-place > div.point .point-grid .tags .stop {
	margin-right: 1rem;
}

.roadbook-item-place > div.point .point-grid .tags .interest {
	display: flex;
	justify-content: space-between;
	gap: 0.5rem;
}

.roadbook-item-place > div.distance {
	flex: 0 0 25%;
	position: relative;
}

.km-total {
	font-size: 1.3rem;
}

.km-part {
	position: absolute;
	right: 0;
	bottom: 0;
	width: 50%;
	height: 33%;
	border-left: 1px solid #000;
	border-top: 1px solid #000;
	box-sizing: border-box;
	display: flex;
	justify-content: center;
	align-items: center;
}

.km-start-end {
	position: absolute;
	left: 0;
	bottom: 0;
	width: 50%;
	height: 33%;
	box-sizing: border-box;
	display: flex;
	justify-content: center;
	align-items: center;
}

.svgicon {
	width: 1.5rem;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 50%;
}

.svgicon img {
	max-height: 1.5rem;
}

.color-culture {
	background-color: yellow;
}

.color-history {
	background-color: brown;
}

.color-sport {
	background-color: blue;
}

.color-stop {
	background-color: red;
}

.roadbook-item-road {
	height: 4rem;
	grid-area: road;
	border: #000 1px solid;
	display: flex;
	flex-wrap: nowrap;
	justify-content: space-between;
	align-items: stretch;
}

.roadbook-item-road > div {
	border: #000 1px solid;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: bold;
}

.roadbook-item-road > div.tulip {
	flex: 0 0 15%;
	position: relative;
}

.tulip.show-before::before {
	content: "!";
	position: absolute;
	left: 1.5rem;
	top: 50%;
	transform: translate(-100%, -50%);
	font-size: 1.5rem;
	font-weight: bold;
}

.tulip.show-before.color-tulip::before {
	color: red;
}

.tulip-img {
	max-width: 70px;
	max-height: 50px;
	display: block;
}

.roadbook-item-road > div.road-no {
	flex: 0 0 15%;
	position: relative;
	display: flex;
	flex-direction: column;
}

.roadbook-item-road > div.road-no .road-no-label {
	flex: 0 0 25%;
	align-self: flex-start;
	font-weight: normal;
}

.roadbook-item-road > div.road-no .road-no-value {
	flex: 1;
	align-self: flex-start;
	margin: 0.1rem 0.3rem;
	max-width: 11rem;
	word-wrap: break-word;
	overflow-wrap: break-word;
	white-space: break-spaces;
	word-break: break-word;
}

.roadbook-item-road > div.note {
	flex: 0 0 70%;
	padding: 0.2rem 0.3rem;
	font-weight: normal;
	justify-content: left;
	align-items: flex-start;
}

.roadbook-item-place > div.map-page {
	flex: 0 0 15%;
	position: relative;
	display: flex;
	flex-direction: column;
	/* Set flex container with column layout */
}

.roadbook-item-place > div.map-page .map-page-label {
	flex: 0 0 25%;
	align-self: flex-start;
	font-weight: normal;
}

.roadbook-item-place > div.map-page .map-page-value {
	flex: 1;
	align-self: flex-start;
	margin: 0.1rem 0.3rem;
	max-width: 9rem;
	word-wrap: break-word;
	overflow-wrap: break-word;
	white-space: break-spaces;
	word-break: break-word;
}

.passed {
	background-color: #d3d3d3;
}
</style>
