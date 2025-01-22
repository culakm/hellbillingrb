let timer;
import { auth } from '../../../firebase.js';
import { getAuth, getIdTokenResult, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from "firebase/auth";

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export default {
	// sledovac zmeny usera, inicializuje sa v App.vue created()
	// handleAuthStateChange() {
	// 	onAuthStateChanged(auth, async (user) => {
	// 		if (user) {
	// 			console.log(`User ${user.email} is signed in`);
	// 		} else {
	// 			console.log('No user is signed in');
	// 		}
	// 	});
	// },
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
		localStorage.removeItem('role');

		clearTimeout(timer);

		context.commit('setUser', {
			token: null,
			userId: null,
			email: null,
			role: null
		});

		signOut(auth);
	},
	autoLogout(context) {
		context.dispatch('logout');
		context.commit('setAutoLogout');
	}
};