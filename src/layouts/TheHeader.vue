<template>
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
			<router-link to="/" class="main-header__brand">
				<img src="/kompas_transparent.png" alt="Hellbilling" style="width: 30px; height: 30px; margin-left: 20px;" >
			</router-link>
			<q-toolbar-title>
				<router-link to="/">Hellbilling</router-link>
			</q-toolbar-title>
			<q-btn v-if="authStore.isAdmin" style="background: primary; color: white" class="q-mr-md" label="Test" to="/test" />
			<q-btn v-if="authStore.isAdmin" style="background: primary; color: white" class="q-mr-md" label="Users" to="/users" />
			<q-btn v-if="authStore.isAuthenticated" style="background: primary; color: white" class="q-mr-md" label="Trips" to="/trips" />
			<q-btn v-if="authStore.isAuthenticated" style="background: primary; color: white" class="q-mr-md" label="Logout" @click="logoutLocal" />
			<q-btn v-else style="background: primary; color: white" class="q-mr-md" label="Login" to="/auth" />
			<q-btn dense flat icon="menu" @click="toggleRightDrawer" />
      </q-toolbar>
    </q-header>
</template>

<script>
	export default {
		name: 'TheHeader',
		props: {
			toggleRightDrawer: Function,
			logoutLocal: Function,
			authStore: Object
		}
	}
</script>
