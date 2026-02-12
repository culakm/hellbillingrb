<template>
	<q-form @submit.prevent="submitForm" class="line-form q-pa-xs q-gutter-xs">
		<q-input class="form-item-name" filled v-model="name" label="Meno" :rules="[optional]" />
		<q-input class="form-item-lat" filled v-model="lat" label="Lat" :rules="coordsRules" autocomplete="off" lazy-rules />
		<q-input class="form-item-lng" filled v-model="lng" label="Lng" :rules="coordsRules" autocomplete="off" lazy-rules />
		<q-btn class="form-item-latlng-copy" dense flat @click="pasteProgrammatic" icon="content_copy" color="primary">
			<q-tooltip>Paste coordinates from clipboard</q-tooltip>
		</q-btn>
		<q-input class="form-item-kmTotal" filled v-model.number="kmTotal" label="kmTotal" type="number" step="0.01" :rules="[optional]" />
		<q-input class="form-item-mapPage" filled v-model="mapPage" label="mapPage" :rules="[optional]" />
		<q-input class="form-item-roadNo" filled v-model="roadNo" label="roadNo" :rules="[optional]" />
		<div class="form-item-tulip">
			<q-select class="form-item-tulip-select" filled v-model="tulip" label="Tulip" :options="tulipOptions" option-value="value" option-label="label" map-options emit-value />
			<div v-if="tulip" class="form-item-tulip-img">
				<q-img :src="tulipSrc" alt="Selected Tulip" style="max-width: 50px" />
			</div>
		</div>
		<div class="form-item-interest">
			<q-option-group v-model="interest" :options="interestOptions" type="checkbox" option-value="value" option-label="label" map-options emit-value label="Zaujímavosť" />
		</div>
		<q-checkbox class="form-item-stop" v-model="stop" label="Zastaviť" color="primary" />
		<q-input class="form-item-note" filled v-model="note" label="Note" type="textarea" />
		<div class="form-item-buttons">
			<q-btn dense flat type="submit" icon="save" color="primary" />
			<template v-if="Object.keys(line).length !== 0">
				<div class="column q-gutter-y-sm">
					<q-btn dense flat @click="$emit('cancel-edit')" icon="close" color="negative" />
				</div>
			</template>
		</div>
	</q-form>
</template>

<script setup>
import { ref, computed, nextTick } from "vue";
import { useTripsStore } from "@/stores/trips";
import { useQuasar } from "quasar";
import { decimalToDMS, DMSToDecimal } from "@/utils";
import { coordsRules, coordsDMS, optional } from "@/composables/useFormValidationRules";

const props = defineProps({
	line: {
		type: Object,
		required: false,
		default: () => ({}),
	},
});
const emit = defineEmits(["save-line", "cancel-edit"]);
const tripsStore = useTripsStore();
const $q = useQuasar();

const tulipOptions = [
	{ label: "Right", value: "tulipR" },
	{ label: "Left", value: "tulipL" },
	{ label: "Front", value: "tulipF" },
];

const interestOptions = [
	{ label: "Pamiatky", value: "history" },
	{ label: "Kultúra", value: "culture" },
	{ label: "Šport", value: "sport" },
];

const lineId = ref(props.line.lineId ?? null);
const order = ref(props.line.order ?? 0);
const lat = ref(props.line.lat ?? "");
const lng = ref(props.line.lng ?? "");
const name = ref(props.line.name ?? "");
const kmTotal = ref(props.line.kmTotal ?? null);
const tulip = ref(props.line.tulip ?? "");
const mapPage = ref(props.line.mapPage ?? null);
const roadNo = ref(props.line.roadNo ?? null);
const interest = ref(props.line.interest ?? []);
const stop = ref(props.line.stop ?? false);
const note = ref(props.line.note ?? "");

const tulipSrc = computed(() => (tulip.value ? `/img/${tulip.value}.svg` : ""));

const pasteProgrammatic = async () => {
	try {
		const text = await navigator.clipboard.readText();
		await nextTick();

		const dialogData = {
			title: "Error",
			message: `Could not parse coordinates from text: <br>"${text}"`,
			html: true,
		};

		const [latStr, lngStr] = text.trim().split(/\s+|,/).filter(Boolean);
		if (!latStr || !lngStr) {
			$q.dialog(dialogData);
			return;
		}

		if (latStr.includes("°") && /[NSEW]/.test(text)) {
			lat.value = latStr;
			lng.value = lngStr;
		} else if (latStr.includes(".")) {
			lat.value = decimalToDMS(Number(latStr).toFixed(6));
			lng.value = decimalToDMS(Number(lngStr).toFixed(6));
		} else {
			$q.dialog(dialogData);
		}
	} catch (err) {
		$q.dialog({ title: "Error", message: err.message || err });
	}
};

const submitForm = async () => {
	if (coordsDMS(lat.value)) {
		lat.value = DMSToDecimal(lat.value);
	}
	if (coordsDMS(lng.value)) {
		lng.value = DMSToDecimal(lng.value);
	}
	const formData = {
		lineId: lineId.value,
		order: order.value,
		lat: lat.value,
		lng: lng.value,
		name: name.value,
		kmTotal: kmTotal.value,
		tulip: tulip.value,
		mapPage: mapPage.value,
		roadNo: roadNo.value,
		interest: interest.value,
		stop: stop.value,
		note: note.value,
		passed: false,
	};

	tripsStore.activeTrip.linesCount++;

	order.value = null;
	lat.value = "";
	lng.value = "";
	name.value = "";
	kmTotal.value = null;
	tulip.value = "";
	mapPage.value = "";
	roadNo.value = "";
	interest.value = [];
	stop.value = false;
	note.value = "";

	emit("save-line", formData);
};
</script>

<style scoped>
.line-form {
	width: 100%;
	display: grid;
	grid-template-areas:
		"form-item-name form-item-lat form-item-lng form-item-latlng-copy . form-item-buttons"
		"form-item-tulip form-item-tulip form-item-kmTotal form-item-mapPage form-item-roadNo form-item-buttons"
		"form-item-interest form-item-stop form-item-note form-item-note form-item-note form-item-buttons";
}

[class^="form-item"] {
	/* padding: 0.3rem; */
}

.form-item-lat {
	grid-area: form-item-lat;
}

.form-item-lng {
	grid-area: form-item-lng;
}

.form-item-latlng-copy {
	grid-area: form-item-latlng-copy;
	align-self: start;
	justify-self: start;
}

.form-item-name {
	grid-area: form-item-name;
}

.form-item-kmTotal {
	grid-area: form-item-kmTotal;
}

.form-item-mapPage {
	grid-area: form-item-mapPage;
}

.form-item-roadNo {
	grid-area: form-item-roadNo;
}

.form-item-interest {
	grid-area: form-item-interest;
	display: grid;
	grid-template-columns: 1fr 1fr;
}

.form-item-stop {
	grid-area: form-item-stop;
	align-items: center;
}

.form-item-note {
	grid-area: form-item-note;
}

.form-item-tulip {
	grid-area: form-item-tulip;
	padding: 0;
	display: flex;
	flex-direction: row;
}

.form-item-tulip-select {
	width: 50%;
	margin: 0;
	padding: 0;
}

.form-item-tulip-img {
	display: flex;
	width: 50%;
	margin: 0;
	padding: 0;
	align-items: center;
	justify-content: center;
}

.form-item-buttons {
	grid-area: form-item-buttons;
	display: flex;
	flex-direction: column;
	align-items: normal;
	justify-content: space-evenly;
}
</style>
