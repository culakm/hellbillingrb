<template>
	<q-card v-if="tripsStore.activeTrip?.hasLines">
		<q-card-section>
			<line-view v-for="line in tripsStore.activeTrip.lines" :key="line.lineId" :line="line"></line-view>
		</q-card-section>
	</q-card>
</template>

<script setup>
import LineView from "../../components/lines/LineView.vue";
import { ref, onMounted } from "vue";
import { useTripsStore } from "@/stores/trips";
import { useQuasar } from "quasar";
const tripsStore = useTripsStore();
const $q = useQuasar();
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
	tripByIdLocal("2kxtdhXjg2s8gmHmLHU4");
});
</script>
