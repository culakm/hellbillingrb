<template>
	<button @click="start">start</button>
	<button @click="pause">pause</button>
	<button @click="disabled = true">disabled</button>
	<div class="flex">
		<VueDraggable v-if="activeTripReactive?.lines?.length" ref="el" v-model="activeTripReactive.lines" item-key="lineId" :animation="150" ghostClass="ghost" @start="onStart" @update="onUpdate" @end="onEnd">
			<p v-for="line in activeTripReactive.lines" :key="line.lineId">riadok: {{ line.name }}</p>
		</VueDraggable>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { VueDraggable } from "vue-draggable-plus";
import { useTripsStore } from "@/stores/trips";
import { storeToRefs } from "pinia";

const tripsStore = useTripsStore();
// urobenie reaktivnej premennej z store
const { activeTrip: activeTripReactive } = storeToRefs(tripsStore);
onMounted(async () => {
	console.log("mounted");
	await tripByIdLocal("IUbdL7mZzy8O8c68zBNl");
	console.log("linesStore:", tripsStore.activeTrip.lines);
});

const tripByIdLocal = async (tripId) => {
	try {
		await tripsStore.setActiveTrip(tripId);
	} catch (err) {
		console.error(err);
	}
};

const el = ref();
const disabled = ref(false);

function pause() {
	if (el.value && el.value.pause) el.value.pause();
}

function start() {
	if (el.value && el.value.start) el.value.start();
}

const onStart = (e) => {
	console.log("start", e);
};

const onEnd = (e) => {
	console.log("onEnd", e);
};

const onUpdate = () => {
	console.log("update");
};
</script>

<style scoped>
.ghost {
	opacity: 0.5;
	background: #c8ebfb;
}
</style>
