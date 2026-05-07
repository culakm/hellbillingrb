import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { auth } from '@/firebase.js';
import {
	onAuthStateChanged,
	getIdTokenResult,
	signInWithEmailAndPassword,
	signOut,
} from 'firebase/auth';

const IDLE_TIMEOUT_MS = 24 * 60 * 60 * 1000;

// One-shot cleanup: prior versions of this store mirrored auth state into
// localStorage. Firebase Auth handles persistence on its own now, so wipe the
// stale keys so they don't leak across upgrades.
for (const key of ['token', 'userId', 'email', 'role', 'tokenExpiration']) {
	localStorage.removeItem(key);
}

export const useAuthStore = defineStore('auth', () => {
	const userId = ref(null);
	const email = ref(null);
	const role = ref(null);
	const didAutoLogout = ref(false);

	const isAuthenticated = computed(() => !!userId.value);
	const isAdmin = computed(() => role.value === 'admin');
	const isEditor = computed(() => role.value === 'editor');
	const isUser = computed(() => role.value === 'user');

	let idleTimer = null;
	const startIdleTimer = () => {
		clearTimeout(idleTimer);
		idleTimer = setTimeout(() => {
			autoLogout();
		}, IDLE_TIMEOUT_MS);
	};
	const clearIdleTimer = () => {
		clearTimeout(idleTimer);
		idleTimer = null;
	};

	let resolveAuthReady;
	const authReady = new Promise((resolve) => {
		resolveAuthReady = resolve;
	});
	let firstFire = true;

	onAuthStateChanged(auth, async (user) => {
		try {
			if (user) {
				const tokenResult = await getIdTokenResult(user);
				userId.value = user.uid;
				email.value = user.email;
				role.value = tokenResult.claims.role ?? null;
				didAutoLogout.value = false;
				startIdleTimer();
			} else {
				userId.value = null;
				email.value = null;
				role.value = null;
				clearIdleTimer();
			}
		} catch (error) {
			console.error(`Error handling auth state change: ${error.message}`);
		} finally {
			if (firstFire) {
				firstFire = false;
				resolveAuthReady();
			}
		}
	});

	const login = async (userData) => {
		try {
			const responseData = await signInWithEmailAndPassword(
				auth,
				userData.email,
				userData.password
			);
			if (!responseData) {
				throw new Error('Failed to login. Check your login data.');
			}
			// Populate role synchronously so post-login navigation that reads
			// isAdmin/isEditor doesn't race the onAuthStateChanged callback.
			const tokenResult = await getIdTokenResult(responseData.user);
			userId.value = responseData.user.uid;
			email.value = responseData.user.email;
			role.value = tokenResult.claims.role ?? null;
		} catch (error) {
			const errorOut = 'Incorrect email or password. Please try again.';
			console.error(errorOut);
			throw new Error(errorOut, { cause: error });
		}
	};

	const logout = async () => {
		try {
			await signOut(auth);
		} catch (error) {
			const errorOut = `Error logging out: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut, { cause: error });
		}
	};

	const autoLogout = async () => {
		try {
			didAutoLogout.value = true;
			await logout();
		} catch (error) {
			const errorOut = `Error during auto logout: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut, { cause: error });
		}
	};

	return {
		userId,
		email,
		role,
		didAutoLogout,
		isAuthenticated,
		isAdmin,
		isEditor,
		isUser,
		authReady,
		login,
		logout,
		autoLogout,
	};
});
