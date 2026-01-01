let timer;
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { auth } from '@/firebase.js';
import { onAuthStateChanged, getIdTokenResult, signInWithEmailAndPassword, signOut } from "firebase/auth";


export const useAuthStore = defineStore('auth', () => {

    // State
	const userId = ref(null);
	const token = ref(null);
	const email = ref(null);
	const role = ref(null);
	const didAutoLogout = ref(false);

    // Getters
    const isAuthenticated = computed(() => !!token.value);
	const isAdmin = computed(() => { return role.value === 'admin' });
	const isEditor = computed(() => { return role.value === 'editor' });
	const isUser = computed(() => { return role.value === 'user' });

	// Actions
	// sledovac zmeny usera, inicializuje sa v App.vue created()
	// handleAuthStateChange() {
	// 	try {
	// 		onAuthStateChanged(auth, async (user) => {
	// 			if (user) {
	// 				console.log(`User ${user.email} is signed in`);
	// 			} else {
	// 				console.log('No user is signed in');
	// 			}
	// 		});
	// 	} catch (error) {
	// 		const errorOut = `Error handling auth state change: ${error.message}`;
	// 		console.error(errorOut);
	// 		throw new Error(errorOut);
	// 	}
	// },
	async function login(userData) {
		try {
			const responseData = await signInWithEmailAndPassword(auth, userData.email, userData.password);
			if (!responseData) {
				const error = new Error(responseData.message || 'Failed to login. Check your login data.');
				throw error;
			}


			const idTokenResult = await getIdTokenResult(responseData.user);
			const claims = idTokenResult.claims;
			const localIdToken = responseData.user.accessToken;
			const localUserId = responseData.user.uid;
			const localEmail = responseData.user.email;
			const localRole = claims.role;
			const expiresIn = +responseData._tokenResponse.expiresIn * 1000;
			const expirationDate = new Date().getTime() + expiresIn;

			localStorage.setItem('token', localIdToken);
			localStorage.setItem('userId', localUserId);
			localStorage.setItem('email', localEmail);
			localStorage.setItem('role', localRole);
			localStorage.setItem('tokenExpiration', expirationDate);

			timer = setTimeout(function () {
				didAutoLogout.value = true;
			}, expiresIn);

			token.value = localIdToken;
			userId.value = localUserId;
			email.value = localEmail;
			role.value = localRole;
			didAutoLogout.value = false;
		} catch (error) {
			const errorOut = `Error logging in: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	}
	function tryLogin() {
		try {
			const localIdToken = localStorage.getItem('token');
			const localUserId = localStorage.getItem('userId');
			const localEmail = localStorage.getItem('email');
			const localRole = localStorage.getItem('role');
			//const tokenExpiration = localStorage.getItem('tokenExpiration');

			// const expiresIn = +tokenExpiration - new Date().getTime();
			const expiresIn = 86400000;
			if (expiresIn < 0) {
				return;
			}

			timer = setTimeout(function () {
				autoLogout();
			}, expiresIn);

			if (localIdToken && localUserId) {
				token.value = localIdToken;
				userId.value = localUserId;
				email.value = localEmail;
				role.value = localRole;
				didAutoLogout.value = false;
			}
		} catch (error) {
			const errorOut = `Error trying to login: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	}
	function logout() {
		try {
			localStorage.removeItem('token');
			localStorage.removeItem('userId');
			localStorage.removeItem('email');
			localStorage.removeItem('tokenExpiration');
			localStorage.removeItem('role');

			clearTimeout(timer);

			token.value = null;
			userId.value = null;
			email.value = null;
			role.value = null;
			didAutoLogout.value = false;

			signOut(auth);
		} catch (error) {
			const errorOut = `Error logging out: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	}

	function autoLogout() {
		try {
			// context.dispatch('logout');
			logout();
			// context.commit('setAutoLogout');
			didAutoLogout.value = true;

		} catch (error) {
			const errorOut = `Error during auto logout: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	}

    return {
        // State
		userId,
		token,
		email,
		role,
		didAutoLogout,
        // Getters
		isAuthenticated,
		isAdmin,
		isEditor,
		isUser,
        // Actions
		login,
		tryLogin,
		logout,
		autoLogout
    };
});