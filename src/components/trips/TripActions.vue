<template>
	<q-item class="q-py-xs trip-link">
		<q-item-section
			class="cursor-pointer relative-position"
			@click="router.push(tripEditLink)"
		>
			<div class="text-subtitle1">{{ trip.name }} - {{ trip.tripId }}</div>
			<div class="text-caption text-grey-7">{{ trip.description }}</div>
			<div
				v-if="ownerLabel"
				class="absolute-top-right text-caption text-grey-8 text-italic q-pa-xs"
			>
				Owner: {{ ownerLabel }}
			</div>
		</q-item-section>
		<q-item-section side>
			<q-btn-group spread class="single-buttons">
				<div
					class="inline-block"
					@mouseenter="openMenu"
					@mouseleave="scheduleClose"
				>
					<q-btn flat text-color="primary" icon="visibility" />
					<q-menu
						v-model="menu"
						anchor="bottom left"
						self="top left"
						:offset="[70, -15]"
						@mouseenter="openMenu"
						@mouseleave="scheduleClose"
					>
						<q-list style="min-width: 100px">
							<q-item v-close-popup clickable :to="tripViewLink">
								<q-item-section>
									<q-item-label>Full</q-item-label>
								</q-item-section>
							</q-item>
							<q-item v-close-popup clickable :to="tripViewTCRLink">
								<q-item-section>
									<q-item-label>TCR</q-item-label>
								</q-item-section>
							</q-item>
						</q-list>
					</q-menu>
				</div>
				<q-btn
					dense
					flat
					icon="delete"
					color="negative"
					@click="deleteTripLocal"
				/>
			</q-btn-group>
		</q-item-section>
	</q-item>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useTripsStore } from '@/stores/trips';
import { useUsersStore } from '@/stores/users';
import { deleteStorageObject } from '@/composables/useFirebaseStorage';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
const menu = ref(false);
let closeTimer = null;

function openMenu() {
	if (closeTimer) {
		clearTimeout(closeTimer);
		closeTimer = null;
	}
	menu.value = true;
}

function scheduleClose() {
	closeTimer = setTimeout(() => {
		menu.value = false;
		closeTimer = null;
	}, 150);
}

const props = defineProps({
	trip: {
		type: Object,
		required: true,
	},
});

const authStore = useAuthStore();
const tripsStore = useTripsStore();
const usersStore = useUsersStore();
const router = useRouter();
const $q = useQuasar();

const tripViewLink = computed(() => `/trip/view/${props.trip.tripId}`);
const tripViewTCRLink = computed(() => `/trip/viewTCR/${props.trip.tripId}`);
const tripEditLink = computed(() => `/trip/edit/${props.trip.tripId}`);

const ownerLabel = computed(() =>
	usersStore.labelForOwner(props.trip?.userId, authStore.userId)
);
const deleteTripLocal = async () => {
	$q.dialog({
		title: 'Confirm',
		message: `Are you sure you want to delete trip: ${props.trip.name}?`,
		cancel: true,
		persistent: true,
	})
		.onOk(async () => {
			const path = `trips/${props.trip.tripId}/${props.trip.imageName}`;
			$q.loading.show();
			try {
				await Promise.all([
					tripsStore.deleteTrip(props.trip.tripId),
					deleteStorageObject(props.trip.imageName, path),
				]);
				$q.loading.hide();
				router.replace('/trips');
			} catch (err) {
				$q.loading.hide();
				$q.dialog({ title: 'Error', message: err.message || err });
			}
		})
		.onCancel(() => {
			return;
		});
};
</script>

<style scoped>
.trip-link {
	transition: background-color 0.2s ease;
}
.trip-link:hover {
	background-color: rgba(0, 0, 0, 0.04);
}
.single-buttons {
	background-color: white;
}
</style>
