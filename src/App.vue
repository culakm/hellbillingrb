<template>
	<the-header v-if="!isTripViewPrint"></the-header>
	<router-view></router-view>
</template>

<script>
import TheHeader from "./components/layout/TheHeader.vue";

export default {
	components: {
		TheHeader,
	},
	computed: {
		didAutoLogout() {
			return this.$store.getters.didAutoLogout;
		},
		isTripViewPrint() {
			return this.$route.path.includes("trip/view/print") ? true : false;
		}
	},
	created() {
		this.$store.dispatch("tryLogin");
		// this.$store.dispatch('handleAuthStateChange');
	},
	watch: {
		didAutoLogout(newValue, oldValue) {
			if (newValue && newValue !== oldValue) {
				this.$router.replace("/");
			}
		}
	}
};
</script>

<style>
	@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");

	* {
		box-sizing: border-box;
	}

	html {
		font-family: "Roboto", sans-serif;
	}

	body {
		margin: 0;
	}
</style>