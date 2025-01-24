<template>
	<header>
		<nav>
			<h1>
				<router-link to="/">HBRB</router-link>
			</h1>
			<ul>
				<li v-if="isAdmin">
					<router-link to="/users">users</router-link>
				</li>
				<li v-if="isAuthenticated">
					<router-link to="/trips">trips</router-link>
				</li>
				<li v-if="isAuthenticated">
					<base-button @click="logoutLocal">Logout {{ email }}, role {{ role }}</base-button>
				</li>
				<li v-else>
					<router-link to="/auth">Login</router-link>
				</li>
			</ul>
		</nav>
	</header>
</template>

<script>

import { mapGetters, mapActions } from 'vuex';
import { cloudFunctions } from '../../firebase.js';
import { httpsCallable } from 'firebase/functions';

export default {
	name: 'TheHeader',
	computed: {
		...mapGetters([
			'isAuthenticated',
			'isAdmin',
			'email',
			'role'
		])
	},
	methods: {
		...mapActions({
			logout: 'logout',
		}),
		logoutLocal() {
			this.logout();
			this.$router.replace('/');
		}
	},
};
</script>

<style scoped>
	header {
		width: 100%;
		height: 5rem;
		background-color: #3d008d;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	header a {
		text-decoration: none;
		color: #f391e3;
		display: inline-block;
		padding: 0.75rem 1.5rem;
		border: 1px solid transparent;
	}

	a:active,
	a:hover,
	a.router-link-active {
		border: 1px solid #f391e3;
	}

	h1 {
		margin: 0;
	}

	h1 a {
		color: white;
		margin: 0;
	}

	h1 a:hover,
	h1 a:active,
	h1 a.router-link-active {
		border-color: transparent;
	}

	header nav {
		width: 90%;
		margin: auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	header ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	li {
		margin: 0 0.5rem;
	}
</style>