<template>
	<header class="main-header">
		<div>
			<router-link to="/" class="main-header__brand"><img src="/kompas_transparent.png"
					alt="Hellbilling Road Book"></router-link>
		</div>
		<nav class="main-nav">
			<ul class="main-nav__items">
				<!-- <li v-if="isAdmin" class="main-nav__item">
					<router-link to="/test">Test page</router-link>
				</li> -->
				<li v-if="isAdmin" class="main-nav__item">
					<router-link to="/users">Users</router-link>
				</li>
				<li v-if="isAuthenticated" class="main-nav__item">
					<router-link to="/trips">Trips</router-link>
				</li>
				<li v-if="isAuthenticated">
					<base-button @click="logoutLocal">Logout {{ email }}, role {{ role }}</base-button>
				</li>
				<li v-else class="main-nav__item main-nav__item--cta">
					<router-link to="/auth">Login</router-link>
				</li>
			</ul>
		</nav>
		<button class="toggle-button" @click="toggleMobileNav">
			<span class="toggle-button__bar"></span>
			<span class="toggle-button__bar"></span>
			<span class="toggle-button__bar"></span>
		</button>
	</header>
	<nav class="mobile-nav" :class="{ open: mobileNavOpened }">
		<ul class="mobile-nav__items" @click="toggleMobileNav">
			<li v-if="isAuthenticated" class="main-nav__item">
				<router-link to="/users">Users OK</router-link>
			</li>
			<li v-if="isAuthenticated" class="main-nav__item">
				<router-link to="/trips">Trips OK</router-link>
			</li>
			<li v-if="isAuthenticated" class="main-nav__item">
				<base-button @click="logoutLocal">Logout {{ email }}, role {{ role }}</base-button>
			</li>
			<li v-else class="main-nav__item main-nav__item--cta">
				<router-link to="/auth">Login</router-link>
			</li>
			<li class="main-nav__item main-nav__item--cta">
				<a href="start-hosting/index.html">Login OK</a>
			</li>
		</ul>
	</nav>
	<div class="backdrop" :class="{ open: mobileNavOpened }" @click="toggleMobileNav"></div>
</template>


<script>

import { mapGetters, mapActions } from 'vuex';

export default {
	name: 'TheHeader',
	data() {
		return {
			mobileNavOpened: false
		};
	},
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
			try {
				this.logout();
				this.$router.replace('/');
			} catch (error) {
				console.error(`Extra error, Component ${this.$options.name}, ERROR: ${error.message}`);
			}
		},
		toggleMobileNav() {
			console.log("toggleMobileNav");
			this.mobileNavOpened = !this.mobileNavOpened;
		}
	}
};
</script>

<style scoped>

	header {
		grid-area: header;
	}

	.main-header {
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
		background: #344a60;
		padding: 0.5rem 1rem;
		z-index: 60;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.toggle-button {
		width: 3rem;
		background: transparent;
		border: none;
		cursor: pointer;
		padding-top: 0;
		padding-bottom: 0;
		vertical-align: middle;
	}

	.toggle-button:focus {
		outline: none;
	}

	.toggle-button__bar {
		width: 100%;
		height: 0.3rem;
		background: black;
		display: block;
		margin: 0.2rem 0;
		border: 1px solid #ffa700;
		border-radius: 7px;
	}

	.main-header__brand {
		text-decoration: none;
		font-weight: bold;
	}

	.main-header__brand img {
		height: 2.5rem;
		vertical-align: middle;
	}

	.main-nav {
		display: none;
	}

	.main-nav__items {
		align-items: baseline;
		margin: 0;
		padding: 0;
		list-style: none;
		display: flex;
	}

	.main-nav__item {
		margin: 0 1rem;
	}

	.main-nav__item a,
	.mobile-nav__item a {
		text-decoration: none;
		color: #ffa700;
		font-weight: bold;
		padding: 0.2rem 0;
	}

	.main-nav__item a:hover,
	.main-nav__item a:active {
		text-decoration: none;
		color: white;
	}

	.main-nav__item--cta a,
	.mobile-nav__item--cta a {
		color: #344a60;
		background: #ffa700;
		padding: 0.5rem 1rem;
		border-radius: 8px;
	}

	.main-nav__item--cta a:hover,
	.main-nav__item--cta a:active,
	.mobile-nav__item--cta a:hover,
	.mobile-nav__item--cta a:active {
		color: #ffa700;
		background: white;
		border: none;
	}

	@media (min-width: 46rem) {
		.toggle-button {
			display: none;
		}

		.main-nav {
			display: flex;
		}
	}

	.main-footer {
		background: #344a60;
		padding: 2rem;
		margin: 0;
		grid-area: footer;
	}

	.mobile-nav {
		display: none;
		position: fixed;
		z-index: 101;
		top: 0;
		right: 0;
		background: #344a60;
		width: 40%;
		height: 100vh;
	}

	.mobile-nav__items {
		width: 90%;
		height: 100%;
		list-style: none;
		margin: 0 auto;
		padding: 0;
		display: flex;
		flex-direction: column;
	}

	.mobile-nav__item {
		margin: 1rem 0;
	}

	.mobile-nav__item a {
		font-size: 1.5rem;
	}

	.button {
		background: #0e4f1f;
		color: white;
		font: inherit;
		border: 1.5px solid #0e4f1f;
		padding: 0.5rem;
		border-radius: 8px;
		font-weight: bold;
		cursor: pointer;
	}

	.button:hover,
	.button:active {
		background: white;
		color: #0e4f1f;
	}

	.button:focus {
		outline: none;
	}

	.button[disabled] {
		cursor: not-allowed;
		border: #a1a1a1;
		background: #ccc;
		color: #a1a1a1;
	}

	.open {
		display: block !important;
	}

	.backdrop {
		position: fixed;
		display: none;
		top: 0;
		left: 0;
		z-index: 100;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.5);
	}
</style>