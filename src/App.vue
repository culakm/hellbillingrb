<template>
	<router-view />
</template>

<script>
import { computed, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

export default {
	name: 'App',
	setup() {
		const authStore = useAuthStore();
		const router = useRouter();
		const $q = useQuasar();

		const didAutoLogoutLocal = computed(() => authStore.didAutoLogout);

		watch(didAutoLogoutLocal, (newValue, oldValue) => {
			if (newValue && newValue !== oldValue) {
				$q.notify({
					type: 'warning',
					message: 'Boli ste odhlásení, prihláste sa znova.',
				});
				router.replace('/');
			}
		});
	},
};
</script>
