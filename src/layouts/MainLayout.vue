<template>
	<q-layout view="hHh lpR fFf">
		<TheHeader
			:toggle-right-drawer="toggleRightDrawer"
			:logout-local="logoutLocal"
			:auth-store="authStore"
		/>
		<TheDrawer
			v-model="rightDrawerOpen"
			:logout-local="logoutLocal"
			:auth-store="authStore"
		/>
		<q-page-container>
			<router-view />
		</q-page-container>
		<TheFooter />
	</q-layout>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import TheHeader from './TheHeader.vue';
import TheDrawer from './TheDrawer.vue';
import TheFooter from './TheFooter.vue';

const componentName = 'MainLayout';
const authStore = useAuthStore();
const router = useRouter();

const rightDrawerOpen = ref(false);

function toggleRightDrawer() {
	rightDrawerOpen.value = !rightDrawerOpen.value;
}

async function logoutLocal() {
	try {
		await authStore.logout();
		await router.replace('/');
	} catch (error) {
		const errorOut = `Component ${componentName}, ERROR: ${error.message}`;
		console.error(errorOut);
		throw new Error(errorOut, { cause: error });
	}
}
</script>
