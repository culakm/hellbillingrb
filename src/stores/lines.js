import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { db } from '../firebase.js';
import { collection, doc, getDocs, deleteDoc } from 'firebase/firestore';

export const useLinesStore = defineStore('lines', () => {
	// State
	const lines = ref([]);
	const tripId = ref(undefined);

	// Reset state
	function $reset() {
		lines.value = [];
		tripId.value = undefined;
	}

	// Getters
	const linesCount = computed(() => lines.value.length);

	// Actions

	// Delete a line in Firestore
	async function deleteLine(localTripId, localLineId) {
		console.log(`Deleting line ${localLineId} from trip ${localTripId}`);
		try {
			await deleteDoc(doc(db, 'trips', localTripId, 'lines', localLineId));
		} catch (error) {
			const errorOut = `Error deleting line: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	}

	// Load lines from Firestore for a given trip
	async function loadLines(localTripId) {
		try {
			const docRef = doc(db, 'trips', localTripId);
			const linesCollectionRef = collection(docRef, 'lines');
			const linesSnapshot = await getDocs(linesCollectionRef);
			const loadedLines = linesSnapshot.docs.map(doc => ({
				lineId: doc.id,
				...doc.data()
			}));
			lines.value = loadedLines;
			tripId.value = localTripId;
		} catch (error) {
			const errorOut = `Error fetching lines for trip ID ${localTripId}: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	}

	return {
		// State
		tripId,
		lines,

		// Reset
		$reset,

		// Getters
		linesCount,

		// Actions
		loadLines,
		deleteLine,
	};
});
