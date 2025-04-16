<template>
	<the-header v-if="!isTripViewPrint"></the-header>
	<router-view></router-view>
	<the-footer v-if="!isTripViewPrint"></the-footer>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import TheHeader from "./components/layout/TheHeader.vue";
import TheFooter from "./components/layout/TheFooter.vue";

export default {
	components: {
		TheHeader,
		TheFooter
	},
	computed: {
		...mapGetters(['didAutoLogout']),
		didAutoLogoutLocal() {
			return this.didAutoLogout;
		},
		isTripViewPrint() {
			return this.$route.path.includes("trip/view/print") ? true : false;
		}
	},
	created() {
		this.tryLogin();
		// this.handleAuthStateChange();
	},
	methods: {
		...mapActions(['tryLogin', 'handleAuthStateChange']),
	},
	watch: {
		didAutoLogoutLocal(newValue, oldValue) {
			if (newValue && newValue !== oldValue) {
				this.$router.replace("/");
			}
		}
	}
};
</script>