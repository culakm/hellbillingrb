import { ref, computed, watch, watchEffect  } from 'vue';
import { defineStore } from 'pinia';
import { db } from '../firebase.js';
import { collection, getDoc, getDocs, setDoc, query, orderBy, doc, writeBatch  } from "firebase/firestore";

export const useLinesStore = defineStore('lines', () => {
	// states
	const lines = ref([]);
	const tripId = ref(undefined);

	function $reset() {
		lines.value = [];
	}

	// getters
	const linesCount = computed(() => lines.value.length);

	async function setTripId(newTripId) {
		tripId.value = newTripId;
		if (newTripId) {
			console.log(`linesStore, setTripId: tripId changed to ${newTripId}`);
			await loadLines(newTripId);  // Await async load here
		}
	}

	async function loadLines(tripId) {
		try {
			const docRef = doc(db, "trips", tripId);

			// Fetch lines subcollection
			const linesCollectionRef = collection(docRef, "lines");
			const linesSnapshot = await getDocs(linesCollectionRef);
			const lines = linesSnapshot.docs.map((doc) => ({
				lineId: doc.id,
				...doc.data(),
			}));

			// // Update the Pinia store (if needed)
			// trips.value = trips.value.map((trip) =>
			// 	trip.tripId === tripId ? { ...trip, lines } : trip
			// );
			lines.value = lines;
			watchEffect(() => console.log("linesStore, loadLines: Trip lines fetched:", lines));

		} catch (error) {
			const errorOut = `Error fetching lines for trip ID ${tripId}: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	}

	async function loadLines(tripId) {
		try {
		  const docRef = doc(db, "trips", tripId);
		  const linesCollectionRef = collection(docRef, "lines");
		  const linesSnapshot = await getDocs(linesCollectionRef);

		  const loadedLines = linesSnapshot.docs.map((doc) => ({
			lineId: doc.id,
			...doc.data(),
		  }));

		  lines.value = loadedLines;  // update store reactive ref

		  watchEffect(() => console.log("linesStore, loadLines: Trip lines fetched:", lines.value));

		} catch (error) {
		  const errorOut = `Error fetching lines for trip ID ${tripId}: ${error.message}`;
		  console.error(errorOut);
		  throw new Error(errorOut);
		}
	}


	return {
		// states
		tripId,
		lines,
		// getters
		linesCount,
		// actions
		setTripId,
		// extra
		$reset,

	};
});