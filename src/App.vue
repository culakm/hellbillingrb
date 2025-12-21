<template>
	<MainLayout v-if="quasarStore.quasarOn"/>
	<template v-else>
		<the-header v-if="!isTripViewPrint"></the-header>
		<router-view></router-view>
		<the-footer v-if="!isTripViewPrint"></the-footer>
	</template>
</template>

<script>
import { computed, watch, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter, useRoute } from 'vue-router';
import { useQuasarStore } from '@/stores/quasar';
import TheHeader from "./components/layout/TheHeader.vue";
import TheFooter from "./components/layout/TheFooter.vue";
import MainLayout from '@/layout/MainLayout.vue';

export default {
	  components: {
		TheHeader,
		TheFooter,
		MainLayout
  },
    setup() {
		const authStore = useAuthStore();
		const quasarStore = useQuasarStore();
        const router = useRouter();
        const route = useRoute();

        const didAutoLogoutLocal = computed(() => authStore.didAutoLogout);
        const isTripViewPrint = computed(() => route.path.includes("trip/view/print"));
        const tryLogin = () => authStore.tryLogin();

        // const handleAuthStateChange = () => store.dispatch('handleAuthStateChange');

        onMounted(() => {
            tryLogin();
			quasarStore.loadFromLocalStorage();
            // handleAuthStateChange();
        });

        watch(didAutoLogoutLocal, (newValue, oldValue) => {
            if (newValue && newValue !== oldValue) {
                router.replace("/");
            }
        });

        return {
			quasarStore,
            isTripViewPrint
        };
    }
};
</script>
