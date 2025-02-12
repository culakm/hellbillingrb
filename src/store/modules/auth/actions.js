let timer;
import { auth } from '../../../firebase.js';
import { onAuthStateChanged, getIdTokenResult, signInWithEmailAndPassword, signOut } from "firebase/auth";

export default {
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
	async login(context, payload) {
		try {
			const responseData = await signInWithEmailAndPassword(auth, payload.email, payload.password);
			if (!responseData) {
				const error = new Error(responseData.message || 'Failed to login. Check your login data.');
				throw error;
			}

			const idTokenResult = await getIdTokenResult(responseData.user);
			const claims = idTokenResult.claims;

			const idToken = responseData.user.accessToken;
			const userId = responseData.user.uid;
			const email = responseData.user.email;
			const role = claims.role;
			const expiresIn = +responseData._tokenResponse.expiresIn * 1000;
			const expirationDate = new Date().getTime() + expiresIn;

			localStorage.setItem('token', idToken);
			localStorage.setItem('userId', userId);
			localStorage.setItem('email', email);
			localStorage.setItem('role', role);
			localStorage.setItem('tokenExpiration', expirationDate);

			timer = setTimeout(function () {
				context.dispatch('autoLogout');
			}, expiresIn);

			context.commit('setUser', {
				token: idToken,
				userId: userId,
				email: email,
				role: role
			});
		} catch (error) {
			const errorOut = `Error logging in: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	},
	tryLogin(context) {
		try {
			const token = localStorage.getItem('token');
			const userId = localStorage.getItem('userId');
			const email = localStorage.getItem('email');
			const role = localStorage.getItem('role');
			//const tokenExpiration = localStorage.getItem('tokenExpiration');

			// const expiresIn = +tokenExpiration - new Date().getTime();
			const expiresIn = 86400000;
			if (expiresIn < 0) {
				return;
			}

			timer = setTimeout(function () {
				context.dispatch('autoLogout');
			}, expiresIn);

			if (token && userId) {
				context.commit('setUser', {
					token: token,
					userId: userId,
					email: email,
					role: role
				});
			}
		} catch (error) {
			const errorOut = `Error trying to login: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	},
	logout(context) {
		try {
			localStorage.removeItem('token');
			localStorage.removeItem('userId');
			localStorage.removeItem('email');
			localStorage.removeItem('tokenExpiration');
			localStorage.removeItem('role');

			clearTimeout(timer);

			context.commit('setUser', {
				token: null,
				userId: null,
				email: null,
				role: null
			});

			signOut(auth);
		} catch (error) {
			const errorOut = `Error logging out: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	},
	autoLogout(context) {
		try {
			context.dispatch('logout');
			context.commit('setAutoLogout');
		} catch (error) {
			const errorOut = `Error during auto logout: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	}
};