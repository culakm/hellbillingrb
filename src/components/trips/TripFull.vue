<template>
	<q-card class="q-pa-md shadow-1 rounded-borders">
		<q-card-section class="row items-center q-gutter-md">
			<q-icon name="directions_car" size="32px" class="q-mr-sm text-primary" />
			<span class="text-h6">{{ trip.name }}</span>
			<q-btn v-if="!$q.fullscreen.isActive" @click="toggleFullscreen" icon="fullscreen" label="Go Fullscreen" />
			<q-btn v-else @click="toggleFullscreen" round icon="fullscreen_exit" class="fullscreen-btn" />
		</q-card-section>
		<q-separator />
		<q-card-section>
			<div class="text-body1 q-mb-sm">{{ trip.description }}</div>
			<div class="text-caption text-grey">Lines: {{ trip.linesCount }}</div>
			<q-img v-if="trip.imageName" :src="imageUrl" alt="Trip image" class="q-mt-md" style="max-width: 100%; max-height: 220px; border-radius: 8px" fit="contain" />
		</q-card-section>
	</q-card>
</template>

<script setup>
import { ref, toRef, onMounted, defineProps } from "vue";
import { fetchFileUrl } from "@/composables/useFirebaseStorage";
import { useQuasar } from "quasar";

const props = defineProps({
	trip: {
		type: Object,
		required: false,
		default: () => ({}),
	},
	pageRef: {
		type: Object,
		required: false,
		default: null,
	},
});

const $q = useQuasar();
const imageUrl = ref("");
const trip = toRef(props, "trip");

const fetchImageUrlLocal = async () => {
	if (!props.trip.imageName) return;
	const path = `trips/${props.trip.tripId}/${props.trip.imageName}`;
	$q.loading.show();
	try {
		imageUrl.value = await fetchFileUrl(props.trip.imageName, path);
		$q.loading.hide();
	} catch (err) {
		$q.loading.hide();
		$q.dialog({ title: "Error", message: err.message || err });
	}
};

const toggleFullscreen = () => {
	const target = props.pageRef.$el;
	if (target && target.requestFullscreen) {
		$q.fullscreen
			.toggle(target)
			.then(() => console.log("Fullscreen toggled"))
			.catch((err) => console.error("Fullscreen failed", err));
	} else {
		console.error("pageRef is not a valid DOM element for fullscreen");
	}
};

onMounted(fetchImageUrlLocal);
</script>

<style scoped>
.fullscreen-btn {
	position: fixed;
	left: 50%;
	bottom: 32px;
	transform: translateX(-50%);
	z-index: 2000;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
}
</style>
