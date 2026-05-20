<template>
	<q-card class="q-pa-md shadow-1 rounded-borders">
		<q-card-section class="row items-center q-gutter-md">
			<q-icon name="directions_car" size="32px" class="q-mr-sm text-primary" />
			<span class="text-h6">{{ trip.name }}</span>
			<q-btn
				v-if="!$q.fullscreen.isActive"
				icon="fullscreen"
				label="Fullscreen"
				@click="toggleFullscreen"
			/>
			<q-btn
				v-else
				round
				icon="fullscreen_exit"
				class="fullscreen-btn"
				@click="toggleFullscreen"
			/>
			<q-btn
				v-if="!tcrPage"
				label="Download PDF"
				color="primary"
				icon="picture_as_pdf"
				:disable="trip.linesCount === 0"
				@click="downloadPdfLocal"
			/>
			<q-btn
				v-if="tcrPage"
				label="Download TCR PDF"
				color="primary"
				icon="picture_as_pdf"
				:disable="trip.linesCount === 0"
				@click="downloadTCRPdf(trip.lines, trip.name)"
			/>
			<div
				v-if="ownerLabel"
				class="text-caption text-italic text-grey-8 q-ml-auto"
			>
				Owner: {{ ownerLabel }}
			</div>
		</q-card-section>
		<q-separator />
		<q-card-section>
			<div class="text-body1 q-mb-sm">{{ trip.description }}</div>
			<div class="text-caption text-grey">Lines: {{ trip.linesCount }}</div>
			<q-img
				v-if="trip.imageName"
				:src="imageUrl"
				alt="Trip image"
				class="q-mt-md"
				style="max-width: 100%; max-height: 220px; border-radius: 8px"
				fit="contain"
			/>
		</q-card-section>
	</q-card>
</template>

<script setup>
import { ref, toRef, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useUsersStore } from '@/stores/users';
import { fetchFileUrl } from '@/composables/useFirebaseStorage';
import { usePdfExport } from '@/composables/usePdfExport';
import { useRoute } from 'vue-router';
import { useQuasar } from 'quasar';

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

const route = useRoute();
const $q = useQuasar();
const authStore = useAuthStore();
const usersStore = useUsersStore();
const { downloadPdf, downloadTCRPdf } = usePdfExport();
const imageUrl = ref('');
const trip = toRef(props, 'trip');

const ownerLabel = computed(() =>
	usersStore.labelForOwner(props.trip?.userId, authStore.userId)
);

const tcrPage = computed(() => {
	return route.path.includes('trip/viewTCR');
});

const fetchImageUrlLocal = async () => {
	if (!props.trip.imageName) return;
	const path = `trips/${props.trip.tripId}/${props.trip.imageName}`;
	$q.loading.show();
	try {
		imageUrl.value = await fetchFileUrl(props.trip.imageName, path);
		$q.loading.hide();
	} catch (err) {
		$q.loading.hide();
		$q.dialog({ title: 'Error', message: err.message || err });
	}
};

const downloadPdfLocal = async () => {
	$q.loading.show();
	try {
		await downloadPdf(trip.value.lines, trip.value.name);
	} catch (err) {
		$q.dialog({ title: 'Error', message: err.message || err });
	} finally {
		$q.loading.hide();
	}
};

const toggleFullscreen = () => {
	const target = props.pageRef.$el;
	if (target && target.requestFullscreen) {
		$q.fullscreen.toggle(target);
	} else {
		console.error('pageRef is not a valid DOM element for fullscreen');
	}
};

onMounted(() => {
	if (props.trip.imageName) {
		fetchImageUrlLocal();
	}
});
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
