let timer;
import { auth } from '../../../firebase.js';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from "firebase/auth";

import { initializeApp, deleteApp } from "firebase/app";
// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export default {
	handleAuthStateChange(context) {
		console.log('auth handleAuthStateChange, volame toto');
		onAuthStateChanged(auth, (user) => {
			console.log('auth handleAuthStateChange, user:', user);
			if (user) {
				context.commit('setUser', {
					token: user.idToken,
					userId: user.userId,
					email: user.email
				})
			}
			console.log('auth handleAuthStateChange, zmenil sa user');
		});
	},
	async addUser(context, payload) {
		const email = payload.email;
		const password = payload.password;
		try {
			const responseData = await createUserWithEmailAndPassword(auth, email, password);
			return responseData.user.uid;
		} catch (error) {
			console.error('Error creating user:', error);
			throw error;
		}
	},
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