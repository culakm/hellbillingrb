import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { initializeFirestore, getFirestore, connectFirestoreEmulator, memoryLocalCache } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

/* Firebase services */
export const auth = getAuth(app);
export const db = getFirestore(app);
// export const db = initializeFirestore(app, {localCache: memoryLocalCache()});
export const storage = getStorage(app);

// if (process.env.NODE_ENV === 'development') {
// 	connectFirestoreEmulator(db, 'localhost', 8080);
// 	connectAuthEmulator(auth, 'http://localhost:9099');
// 	connectStorageEmulator(storage, 'localhost', 9199);
// }