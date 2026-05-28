<template>
	<q-layout view="lHh Lpr lFf" class="bg-grey-1">
		<q-header class="app-header bg-white text-dark">
			<q-toolbar class="q-px-md" style="height: 64px">
				<div class="row items-center q-ml-sm q-gutter-sm">
					<q-avatar
						size="36px"
						color="primary"
						text-color="white"
						icon="navigation"
					/>
					<div>
						<div class="text-subtitle1 text-weight-bold">Hellbilling</div>
						<div class="text-caption text-grey-6">Trips workspace</div>
					</div>
				</div>

				<q-space />

				<q-input
					dense
					outlined
					rounded
					placeholder="Search trips"
					style="width: 280px"
					class="q-mr-md"
				>
					<template #prepend>
						<q-icon name="search" />
					</template>
				</q-input>

				<q-btn flat round icon="notifications" class="q-mr-sm" />
				<q-btn flat round icon="dark_mode" class="q-mr-sm" />

				<q-btn flat no-caps class="user-btn">
					<q-avatar size="32px" color="grey-3" text-color="dark">KE</q-avatar>
					<span class="q-ml-sm">Karol</span>
				</q-btn>
			</q-toolbar>
		</q-header>

		<q-drawer
			v-model="leftDrawerOpen"
			show-if-above
			bordered
			:mini="miniState"
			:width="260"
			:breakpoint="1024"
			class="bg-grey-1"
		>
			<div class="q-pa-md">
				<q-btn
					flat
					dense
					round
					:icon="miniState ? 'chevron_right' : 'chevron_left'"
					@click="miniState = !miniState"
				/>
			</div>

			<q-list padding class="nav-list">
				<q-item clickable active active-class="nav-active">
					<q-item-section avatar><q-icon name="route" /></q-item-section>
					<q-item-section>Trips</q-item-section>
				</q-item>

				<q-item clickable>
					<q-item-section avatar><q-icon name="group" /></q-item-section>
					<q-item-section>Users</q-item-section>
				</q-item>

				<q-item clickable>
					<q-item-section avatar><q-icon name="quiz" /></q-item-section>
					<q-item-section>Test</q-item-section>
				</q-item>
			</q-list>
		</q-drawer>

		<q-page-container>
			<q-page class="q-pa-lg">
				<div class="row items-center justify-between q-mb-lg">
					<div>
						<div class="text-h5 text-weight-bold">Trips</div>
						<div class="text-grey-7">4 active records</div>
					</div>

					<div class="row items-center q-gutter-sm">
						<q-toggle v-model="allUsers" label="All users' trips" />
						<q-btn
							color="primary"
							unelevated
							no-caps
							icon="add"
							label="Add trip"
						/>
					</div>
				</div>

				<div class="column q-gutter-md">
					<q-card
						v-for="trip in trips"
						:key="trip.id"
						flat
						bordered
						class="trip-card"
					>
						<q-card-section class="row items-center no-wrap">
							<div class="col">
								<div class="text-subtitle1 text-weight-medium">
									{{ trip.name }}
								</div>
								<div class="text-caption text-grey-7">
									{{ trip.description }}
								</div>
							</div>

							<q-chip square color="grey-2" text-color="dark" icon="person">
								{{ trip.owner }}
							</q-chip>

							<div class="row q-ml-md q-gutter-xs">
								<q-btn flat round dense icon="visibility" color="primary" />
								<q-btn flat round dense icon="delete" color="negative" />
							</div>
						</q-card-section>
					</q-card>
				</div>
			</q-page>
		</q-page-container>
	</q-layout>
</template>

<script setup>
import { ref } from 'vue';

const leftDrawerOpen = ref(true);
const miniState = ref(false);
const allUsers = ref(true);

const trips = ref([
	{ id: 1, name: 'trip 1', description: '1 package', owner: 'pako' },
	{ id: 2, name: 'trip 2', description: '2 packages', owner: 'pako' },
	{ id: 3, name: 'tt3', description: 'test trip', owner: 'pako' },
]);
</script>

<style scoped>
.app-header {
	border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}

.nav-list .q-item {
	border-radius: 12px;
	margin: 4px 8px;
	min-height: 44px;
}

.nav-active {
	background: rgba(25, 118, 210, 0.12);
	color: #1976d2;
	font-weight: 600;
}

.trip-card {
	border-radius: 16px;
	background: white;
	transition:
		transform 0.18s ease,
		box-shadow 0.18s ease;
}

.trip-card:hover {
	transform: translateY(-1px);
	box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
}

.user-btn {
	border-radius: 999px;
	padding: 6px 10px;
	background: rgba(15, 23, 42, 0.04);
}
</style>
