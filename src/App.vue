<template>
    <the-header v-if="!isTripViewPrint"></the-header>
    <router-view></router-view>
    <the-footer v-if="!isTripViewPrint"></the-footer>
</template>

<script>
import { computed, watch, onMounted } from 'vue';
// import { useStore } from 'vuex';
import { useAuthStore } from '@/stores/auth';
import { useRouter, useRoute } from 'vue-router';
import TheHeader from "./components/layout/TheHeader.vue";
import TheFooter from "./components/layout/TheFooter.vue";

export default {
    components: {
        TheHeader,
        TheFooter
    },
    setup() {
        // const store = useStore();
		const authStore = useAuthStore();
        const router = useRouter();
        const route = useRoute();

        // Access Vuex getter
        // const didAutoLogout = computed(() => store.getters['didAutoLogout']);
		const didAutoLogout = computed(() => authStore.didAutoLogout());

        // Alias for watcher (mirrors original code)
        const didAutoLogoutLocal = computed(() => authStore.didAutoLogout);

        // Compute if current route is trip/view/print
        const isTripViewPrint = computed(() => route.path.includes("trip/view/print"));

        // Vuex actions
        // const tryLogin = () => store.dispatch('tryLogin');
        const tryLogin = () => authStore.tryLogin();

        // const handleAuthStateChange = () => store.dispatch('handleAuthStateChange');

        // Run on component mount (created -> onMounted)
        onMounted(() => {
            tryLogin();
            // handleAuthStateChange();
        });

        // Watch for auto logout and redirect if needed
        watch(didAutoLogoutLocal, (newValue, oldValue) => {
            if (newValue && newValue !== oldValue) {
                router.replace("/");
            }
        });

        return {
            isTripViewPrint
        };
    }
};
</script>
