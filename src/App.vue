<template>
    <the-header v-if="!isTripViewPrint"></the-header>
    <router-view></router-view>
    <the-footer v-if="!isTripViewPrint"></the-footer>
</template>

<script>
import { computed, watch, onMounted } from 'vue';
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

        return {
            isTripViewPrint
        };
    }
};
</script>
