<template>
	<q-header class="bg-primary text-white" height-hint="98">
		<q-toolbar>
			<q-btn
				v-if="authStore.isAdmin"
				dense
				flat
				icon="menu"
				@click="toggleLeftDrawer"
			/>
			<router-link to="/" class="main-header__brand">
				<img
					src="/kompas_transparent.png"
					alt="Hellbilling"
					style="width: 30px; height: 30px; margin-left: 20px"
				/>
			</router-link>
			<q-toolbar-title>
				<router-link to="/">Hellbilling</router-link>
			</q-toolbar-title>
			<q-btn
				v-if="authStore.isAuthenticated"
				dense
				flat
				:label="authStore.email"
				@click="toggleRightDrawer"
			/>
			<q-btn v-else dense flat label="Login" to="/auth" />
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
