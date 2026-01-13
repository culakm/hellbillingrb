<template>
	<q-page class="q-pa-md bg-grey-2">
		<q-card ref="pageRef">
			<trip-full v-if="tripsStore.activeTrip" :trip="tripsStore.activeTrip" :pageRef="pageRef"></trip-full>
			<div v-if="tripsStore.activeTrip?.hasLines">
				<line-view v-for="line in tripsStore.activeTrip.lines" :key="line.lineId" :line="line"></line-view>
			</div>
		</q-card>
	</q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useTripsStore } from "@/stores/trips";
import { useRoute } from "vue-router";
import { useQuasar } from "quasar";
import TripFull from "../../components/trips/TripFull.vue";
import LineView from "../../components/lines/LineView.vue";

const tripsStore = useTripsStore();
const route = useRoute();
const $q = useQuasar();

const pageRef = ref(null);

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

onMounted(() => {
	tripByIdLocal(route.params.tripId);
});
</script>

<style scoped>
/* toto je tu kvoli scrolovaniu vo fullscreene */
:fullscreen,
:-webkit-full-screen {
	overflow: auto !important;
}
</style>
