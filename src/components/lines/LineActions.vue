<template>
	<q-card class="q-mb-md q-pa-sm">
		<q-card-section class="q-pa-none">
			<template v-if="!isEdited">
				<div class="row items-center no-wrap">
					<div class="col">
						<line-view :line="line" />
					</div>
					<div class="column q-gutter-y-sm">
						<q-btn dense flat icon="edit" color="primary" @click="setEditedLine" />
						<q-btn dense flat icon="delete" color="negative" @click="deleteLineLocal" />
					</div>
				</div>
			</template>
			<template v-else>
				<line-form @save-line="editLineLocal" @cancel-edit="cancelEditLocal" :line="line" />
			</template>
		</q-card-section>
	</q-card>
</template>

<script setup>
import { ref, toRef } from "vue";
import { useQuasar } from "quasar";
import { useTripsStore } from "@/stores/trips";
import { useLinesStore } from "@/stores/lines";
import LineView from "./LineView.vue";
import LineForm from "./LineForm.vue";

const props = defineProps({
	tripId: {
		type: String,
		required: true,
	},
	line: {
		type: Object,
		required: true,
		default: () => ({ interest: [] }),
	},
});
const emit = defineEmits(["line-is-edited"]);
const $q = useQuasar();
const linesStore = useLinesStore();
const tripsStore = useTripsStore();

const isEdited = ref(false);

const editLineLocal = async (lineData) => {
	$q.loading.show();
	try {
		lineData.tripId = props.tripId;
		await linesStore.editLine(lineData);
		$q.loading.hide();
	} catch (err) {
		$q.dialog({ title: "Error", message: err.message || err });
		$q.loading.hide();
	}
	setEditedLine();
};

const deleteLineLocal = async () => {
	$q.loading.show();
	try {
		tripsStore.activeTrip.linesCount--;
		await linesStore.deleteLine(props.tripId, props.line.lineId);
		$q.loading.hide();
	} catch (err) {
		$q.dialog({ title: "Error", message: err.message || err });
		$q.loading.hide();
	}
};

const setEditedLine = () => {
	isEdited.value = !isEdited.value;
	emit("line-is-edited");
};

const cancelEditLocal = () => {
	isEdited.value = false;
	emit("line-is-edited");
};

const line = toRef(props, "line");
</script>

<style scoped>
li {
	list-style-type: none;
	padding: 10px;
	margin-bottom: 10px;
	border: 1px solid #ddd;
	border-radius: 5px;
	background-color: #f9f9f9;
	transition: background-color 0.3s ease;
}

li:hover {
	background-color: #e9e9e9;
}

div {
	margin: 0.5rem 0;
}

.actions {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	justify-content: flex-end;
}
</style>
