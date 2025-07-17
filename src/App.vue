<template>
    <the-header v-if="!isTripViewPrint"></the-header>
    <router-view></router-view>
    <the-footer v-if="!isTripViewPrint"></the-footer>
</template>

<script>
import { computed, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import TheHeader from "./components/layout/TheHeader.vue";
import TheFooter from "./components/layout/TheFooter.vue";

export default {
    components: {
        TheHeader,
        TheFooter
    },
    setup() {
        const store = useStore();
        const router = useRouter();
        const route = useRoute();

        // Access Vuex getter
        const didAutoLogout = computed(() => store.getters['didAutoLogout']);

        // Alias for watcher (mirrors original code)
        const didAutoLogoutLocal = computed(() => didAutoLogout.value);

        // Compute if current route is trip/view/print
        const isTripViewPrint = computed(() => route.path.includes("trip/view/print"));

        // Vuex actions
        const tryLogin = () => store.dispatch('tryLogin');
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
