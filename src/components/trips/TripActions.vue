<template>
	<q-item class="q-py-sm">
		<q-item-section>
			<div class="text-subtitle1">{{ name }}</div>
			<div class="text-caption text-grey-7">{{ description }}</div>
		</q-item-section>
		<q-item-section side>
			<q-btn-group spread>
				<q-btn dense flat icon="visibility" color="primary" :to="tripViewLink" />
				<q-btn dense flat icon="edit" color="primary" :to="tripEditLink" />
				<q-btn dense flat icon="print" color="secondary" :to="tripPrintLink" target="_blank" />
				<q-btn dense flat icon="delete" color="negative" @click="deleteTripLocal" />
			</q-btn-group>
		</q-item-section>
	</q-item>
</template>

<script setup>
import { computed, defineProps } from "vue";
import { useTripsStore } from "@/stores/trips";
import { deleteStorageObject } from "@/composables/useFirebaseStorage";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

const props = defineProps({
	tripId: {
		type: [String, Number],
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: false,
		default: "",
	},
	imageName: {
		type: String,
		required: false,
		default: "",
	},
});

const tripsStore = useTripsStore();
const router = useRouter();
const $q = useQuasar();

const tripViewLink = computed(() => `/trip/view/${props.tripId}`);
const tripPrintLink = computed(() => `/trip/view/print/${props.tripId}`);
const tripEditLink = computed(() => `/trip/edit/${props.tripId}`);

const deleteTripLocal = async () => {
	$q.dialog({
		title: "Confirm",
		message: `Are you sure you want to delete trip: ${props.name}?`,
		cancel: true,
		persistent: true,
	})
		.onOk(async () => {
			const path = `trips/${props.tripId}/${props.imageName}`;
			$q.loading.show();
			try {
				await Promise.all([tripsStore.deleteTrip(props.tripId), deleteStorageObject(props.imageName, path)]);
				$q.loading.hide();
				router.replace("/trips");
			} catch (err) {
				$q.loading.hide();
				$q.dialog({ title: "Error", message: err.message || err });
			}
		})
		.onCancel(() => {
			return;
		});
};
</script>
