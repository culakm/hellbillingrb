<template>
	<q-form @submit.prevent="submitForm" class="line-form q-pa-xs q-gutter-xs">
		<q-input class="form-item-name" filled v-model="name" label="Meno" :rules="[required]" autocomplete="off" lazy-rules />
		<q-input class="form-item-kmTotal" filled v-model.number="kmTotal" label="kmTotal" type="number" step="0.01" />
		<q-input class="form-item-mapPage" filled v-model="mapPage" label="mapPage" />
		<q-input class="form-item-roadNo" filled v-model="roadNo" label="RoadNo" />
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
			<q-btn v-if="Object.keys(line).length === 0" type="submit" dense flat icon="save" color="primary" />
			<template v-else>
				<div class="column q-gutter-y-sm">
					<q-btn dense flat type="submit" icon="save" color="primary" />
					<q-btn dense flat @click="$emit('cancel-edit')" icon="close" color="negative" />
				</div>
			</template>
		</div>
	</q-form>
</template>

<script setup>
import { ref, computed } from "vue";
import { useTripsStore } from "@/stores/trips";
import { required } from "@/composables/useFormValidationRules";

const props = defineProps({
	line: {
		type: Object,
		required: false,
		default: () => ({}),
	},
});
const emit = defineEmits(["save-line", "cancel-edit"]);
const tripsStore = useTripsStore();

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
const name = ref(props.line.name ?? "");
const kmTotal = ref(props.line.kmTotal ?? null);
const tulip = ref(props.line.tulip ?? "");
const mapPage = ref(props.line.mapPage ?? null);
const roadNo = ref(props.line.roadNo ?? null);
const interest = ref(props.line.interest ?? []);
const stop = ref(props.line.stop ?? false);
const note = ref(props.line.note ?? "");

const tulipSrc = computed(() => (tulip.value ? `/img/${tulip.value}.svg` : ""));

const submitForm = async () => {
	const formData = {
		lineId: lineId.value,
		order: order.value,
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
		"form-item-name form-item-kmTotal form-item-mapPage form-item-roadNo form-item-tulip form-item-buttons"
		"form-item-interest form-item-stop form-item-note form-item-note form-item-tulip form-item-buttons";
}

[class^="form-item"] {
	/* padding: 0.3rem; */
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
	flex-direction: column;
}

.form-item-tulip-select {
	margin: 0;
	padding: 0;
}

.form-item-tulip-img {
	display: flex;
	align-items: center;
	justify-content: center;
	max-height: 50px;
	margin: 0;
	padding: 0;
}

.form-item-buttons {
	grid-area: form-item-buttons;
	display: flex;
	flex-direction: column;
	align-items: normal;
	justify-content: space-evenly;
}
</style>
