let timer;
import { auth } from '../../../firebase.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";

export default {
	async login(context, payload) {
		const responseData = await signInWithEmailAndPassword(auth, payload.email, payload.password);
		if (!responseData) {
			const error = new Error(responseData.message || 'Failed to login. Check your login data.');
			throw error;
		}

		const idToken = responseData.user.accessToken;
		const userId = responseData.user.uid;
		const email = responseData.user.email;
		const expiresIn = +responseData._tokenResponse.expiresIn * 1000;
		const expirationDate = new Date().getTime() + expiresIn;

		localStorage.setItem('token', idToken);
		localStorage.setItem('userId', userId);
		localStorage.setItem('email', email);
		localStorage.setItem('tokenExpiration', expirationDate);


		timer = setTimeout(function () {
			context.dispatch('autoLogout');
		}, expiresIn);

		context.commit('setUser', {
			token: idToken,
			userId: userId,
			email: email
		});

	},
	tryLogin(context) {
		const token = localStorage.getItem('token');
		const userId = localStorage.getItem('userId');
		const email = localStorage.getItem('email');
		const tokenExpiration = localStorage.getItem('tokenExpiration');

		const expiresIn = +tokenExpiration - new Date().getTime();

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
				email: email
			});
		}
	},
	logout(context) {
		localStorage.removeItem('token');
		localStorage.removeItem('userId');
		localStorage.removeItem('email');
		localStorage.removeItem('tokenExpiration');

		clearTimeout(timer);

		context.commit('setUser', {
			token: null,
			userId: null,
			email: null
		});

		signOut(auth);
	},
	autoLogout(context) {
		context.dispatch('logout');
		context.commit('setAutoLogout');
	}
};