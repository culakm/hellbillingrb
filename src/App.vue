<template>
  <router-view />
</template>

<script>
import { computed, watch, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter, useRoute } from 'vue-router';

export default {
	name: 'App',
    setup() {
		const authStore = useAuthStore();
        const router = useRouter();
        const route = useRoute();

        const didAutoLogoutLocal = computed(() => authStore.didAutoLogout);
        const isTripViewPrint = computed(() => route.path.includes("trip/view/print"));
        const tryLogin = () => authStore.tryLogin();

        // const handleAuthStateChange = () => store.dispatch('handleAuthStateChange');

        onMounted(() => {
            tryLogin();
            // handleAuthStateChange();
        });

        watch(didAutoLogoutLocal, (newValue, oldValue) => {
            if (newValue && newValue !== oldValue) {
                router.replace("/");
            }
        });
    }
};
</script>
