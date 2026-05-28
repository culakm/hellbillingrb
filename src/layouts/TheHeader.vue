<template>
	<q-header elevated class="app-header bg-white text-dark" height-hint="98">
		<q-toolbar>
			<div class="row items-center q-gutter-sm">
				<q-btn
					v-if="authStore.isAdmin"
					flat
					round
					icon="menu"
					@click="toggleLeftDrawer"
				/>
				<router-link to="/" class="row items-center no-decoration">
					<img
						src="/kompas_transparent.png"
						alt="Hellbilling"
						style="width: 30px; height: 30px"
					/>
					<div class="q-ml-sm">
						<div class="text-subtitle1 text-weight-bold">Hellbilling</div>
						<div class="text-caption text-grey-6">Trips workspace</div>
					</div>
				</router-link>
			</div>
			<q-space />
			<q-btn
				v-if="authStore.isAuthenticated"
				dense
				flat
				no-caps
				class="user-btn"
				@click="toggleRightDrawer"
			>
				<!-- <q-avatar size="32px" color="grey-3" text-color="dark">KE</q-avatar> -->
				<span class="q-ml-sm">{{ authStore.email }}</span>
			</q-btn>
			<q-btn
				v-else
				dense
				flat
				no-caps
				class="user-btn"
				label="Login"
				to="/auth"
			/>
		</q-toolbar>
	</q-header>
</template>

<script setup>
defineProps({
	toggleRightDrawer: { type: Function, required: true },
	toggleLeftDrawer: { type: Function, required: true },
	logoutLocal: { type: Function, required: true },
	authStore: { type: Object, required: true },
});
</script>

<style scoped>
.app-header {
	border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}

.no-decoration {
	color: inherit;
	text-decoration: none;
}

.user-btn {
	border-radius: 999px;
	padding: 6px 10px;
	background: rgba(15, 23, 42, 0.04);
}
</style>
