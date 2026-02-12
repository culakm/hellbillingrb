import { initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
const isDevelopment = import.meta.env.MODE === "development";

const app = initializeApp(firebaseConfig);

if (isDevelopment) {
	console.log("Firebase App Check debug mode enabled. PROJECT ID IS : " + import.meta.env.VITE_FIREBASE_PROJECT_ID);
	if (import.meta.env.VITE_FIREBASE_PROJECT_ID !== "hellbilling") {
		console.log('Using foreign "hellbilling" debug token : ' + import.meta.env.VITE_FIREBASE_APPCHECK_DEBUG_TOKEN_HB);
		self.FIREBASE_APPCHECK_DEBUG_TOKEN = import.meta.env.VITE_FIREBASE_APPCHECK_DEBUG_TOKEN_HB;
	} else {
		console.log("Using my own hellbilling debug token : " + import.meta.env.VITE_FIREBASE_APPCHECK_DEBUG_TOKEN);
		self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
	}
}

initializeAppCheck(app, {
	provider: new ReCaptchaEnterpriseProvider(import.meta.env.VITE_RECAPTCHA_SITE_KEY),
	isTokenAutoRefreshEnabled: true,
});

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const cloudFunctions = getFunctions(app);

const checkEmulators = async () => {
	try {
		let response;
		if (import.meta.env.VITE_FIREBASE_PROJECT_ID !== "hellbilling") {
			response = await fetch("http://localhost:4001/emulator/v1/projects");
		} else {
			response = await fetch("http://localhost:4000/emulator/v1/projects");
		}
		return response.status === 200;
	} catch (e) {
		return false;
	}
};

// vselijake varianty
// if (process.env.NODE_ENV) {
// if (import.meta.env.VITE_FIREBASE_RUN_EMULATOR === 'true') {
if (isDevelopment && (await checkEmulators())) {
	console.log("🔧 Using Firebase Emulators");
	connectFirestoreEmulator(db, "localhost", 8081);
	connectAuthEmulator(auth, "http://localhost:9100");
	connectStorageEmulator(storage, "localhost", 9200);
	connectFunctionsEmulator(cloudFunctions, "localhost", 5002);
} else {
	console.log("🔥 Using Production Firebase");
}
