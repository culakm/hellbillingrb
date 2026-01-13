import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { db } from "../firebase.js";
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, query, where, orderBy, writeBatch } from "firebase/firestore";
import { useAuthStore } from "@/stores/auth";
import { useLinesStore } from "@/stores/lines";

export const useTripsStore = defineStore("trips", () => {
	const authStore = useAuthStore();
	const linesStore = useLinesStore();

	// State
	const trips = ref([]);
	const activeTrip = ref(null);

	// Reset state
	const $reset = () => {
		trips.value = [];
		activeTrip.value = null;
	};

	// Getters
	const hasTrips = computed(() => trips.value.length > 0);
	const tripsCount = computed(() => trips.value.length);

	// Actions
	const getNewTripId = async () => {
		try {
			const newDocRef = doc(collection(db, "trips"));
			return newDocRef.id;
		} catch (error) {
			const errorOut = `Error generating new trip ID: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	};

	const setActiveTrip = async (tripId) => {
		activeTrip.value = await getTripById(tripId);
		if (activeTrip.value) {
			await linesStore.loadLines(tripId);
			activeTrip.value.linesCount = linesStore.linesCount;
			activeTrip.value.hasLines = linesStore.linesCount > 0;
			activeTrip.value.lines = linesStore.lines;
		}
	};

	const getTripById = async (tripId) => {
		if (activeTrip.value?.tripId === tripId) {
			return activeTrip.value;
		}
		if (!trips.value || trips.value.length === 0) {
			if (authStore.isAdmin) {
				await loadTrips();
			} else if (authStore.userId) {
				await loadTrips(authStore.userId);
			}
		}
		const localTrip = trips.value.find((t) => t.tripId === tripId) || null;
		if (!localTrip) {
			const errorOut = `Error : Trip not found`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
		return localTrip;
	};

	const clearActiveTrip = () => {
		activeTrip.value = null;
	};

	const updateTripImage = async (tripId, imageName) => {
		try {
			const tripRef = doc(db, "trips", tripId);
			await setDoc(tripRef, { imageName }, { merge: true });
			activeTrip.imageName = imageName;
		} catch (error) {
			const errorOut = `Error updating trip image: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	};

	const deleteTripImage = async (tripId) => {
		try {
			const tripRef = doc(db, "trips", tripId);
			await updateDoc(tripRef, { imageName: "" });
			activeTrip.imageName = "";
			return tripId;
		} catch (error) {
			const errorOut = `Error deleting trip image: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	};

	const loadTrips = async (userId = null) => {
		try {
			const tripsCollectionRef = collection(db, "trips");
			let tripsQuery;
			if (userId) {
				tripsQuery = query(tripsCollectionRef, orderBy("name", "asc"), where("userId", "==", userId));
			} else {
				tripsQuery = query(tripsCollectionRef, orderBy("name", "asc"));
			}
			const querySnapshot = await getDocs(tripsQuery);
			const loadedTrips = querySnapshot.docs.map((docSnap) => ({
				tripId: docSnap.id,
				...docSnap.data(),
			}));
			trips.value = loadedTrips;
		} catch (error) {
			const errorOut = `Error loading trips: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	};

	const createTrip = async (tripData) => {
		try {
			await setDoc(doc(db, "trips", tripData.tripId), tripData);
			trips.value.push(tripData);
		} catch (error) {
			const errorOut = `Error creating trip: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	};

	const updateTrip = async (tripData) => {
		try {
			await setDoc(doc(db, "trips", tripData.tripId), tripData);
			activeTrip.value = { ...activeTrip.value, ...tripData };
		} catch (error) {
			const errorOut = `Error updating trip: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	};

	const deleteTrip = async (tripId) => {
		try {
			const tripDocRef = doc(db, "trips", tripId);
			const docSnap = await getDoc(tripDocRef);
			if (!docSnap.exists()) {
				throw new Error(`Trip document ${tripId} does not exist`);
			}
			const linesCollectionRef = collection(db, "trips", tripId, "lines");
			const linesSnapshot = await getDocs(linesCollectionRef);
			const batch = writeBatch(db);
			linesSnapshot.docs.forEach((lineDoc) => batch.delete(lineDoc.ref));
			batch.delete(tripDocRef);
			await batch.commit();
			const index = trips.value.findIndex((t) => t.tripId === tripId);
			if (index !== -1) trips.value.splice(index, 1);
			if (activeTrip.value?.tripId === tripId) activeTrip.value = null;
		} catch (error) {
			const errorOut = `Error deleting trip: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	};

	return {
		// State
		trips,
		activeTrip,

		// Reset
		$reset,

		// Getters
		hasTrips,
		tripsCount,

		// Actions
		getNewTripId,
		setActiveTrip,
		clearActiveTrip,
		updateTripImage,
		deleteTripImage,
		loadTrips,
		createTrip,
		updateTrip,
		deleteTrip,
	};
});
