<template>
	<q-page class="q-pa-md bg-grey-2">
		<Container>
			<trip-form @save-data="createTripLocal" />
		</Container>
	</q-page>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { useTripsStore } from "@/stores/trips";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import TripForm from "@/components/trips/TripForm.vue";

const componentName = "TripCreate";
const authStore = useAuthStore();
const tripsStore = useTripsStore();
const router = useRouter();
const $q = useQuasar();

const createTripLocal = async (tripData) => {
	tripData.userId = authStore.userId;
	$q.loading.show();
	try {
		await tripsStore.createTrip(tripData);
		$q.loading.hide();
		$q.dialog({
			title: "Success",
			message: "Trip created successfully.",
		}).onOk(() => {
			router.replace("/trips");
		});
	} catch (err) {
		$q.loading.hide();
		$q.dialog({ title: "Error", message: err.message || err });
		return;
	}
};
</script>
