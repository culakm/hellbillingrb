import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { db } from '../firebase.js';
import { collection, getDoc, getDocs, setDoc, query, orderBy, doc, writeBatch } from 'firebase/firestore';
import { useLinesStore } from '@/stores/lines';

export const useTripsStore = defineStore('trips', () => {
	// Access lines store for line operations
	const linesStore = useLinesStore();

	// State
	const trips = ref([]);
	const trip = ref(null);

	// Reset state
	function $reset() {
		trips.value = [];
		trip.value = null;
	}

	// Getters
	const hasTrips = computed(() => trips.value.length > 0);
	const tripsCount = computed(() => trips.value.length);

	// Utility: Find a trip by ID, prefer current trip cache
	function getTripById(tripId) {
		if (trip.value?.tripId === tripId) return trip.value;
		return trips.value.find(t => t.tripId === tripId) || null;
	}

	// Actions

	// Set the active trip by tripId
	function setActiveTrip(tripId) {
		trip.value = getTripById(tripId);
	}

	// Clear active trip
	function clearActiveTrip() {
		trip.value = null;
	}

	// Generate a new trip ID
	async function getNewTripId() {
		try {
			const newDocRef = doc(collection(db, 'trips'));
			return newDocRef.id;
		} catch (error) {
			const errorOut = `Error generating new trip ID: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	}

	// Create a new trip and add it to local store
	async function createTrip(name) {
		try {
			const tripId = await getNewTripId();
			const tripData = {
				tripId,
				name,
				description: 'default description',
				userId: null,
				imageName: '',
				linesCount: 0
			};
			await setDoc(doc(db, 'trips', tripId), tripData);
			trips.value.push(tripData);
		} catch (error) {
			const errorOut = `Error creating trip: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	}

	// Load all trips from Firestore
	async function loadTrips() {
		try {
			const tripsCollectionRef = collection(db, 'trips');
			const tripsQuery = query(tripsCollectionRef, orderBy('name', 'asc'));
			const querySnapshot = await getDocs(tripsQuery);
			const loadedTrips = querySnapshot.docs.map(docSnap => ({
				tripId: docSnap.id,
				...docSnap.data()
			}));
			trips.value = loadedTrips;
		} catch (error) {
			const errorOut = `Error loading trips: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	}

	// Fetch a specific trip by ID and update local state
	async function fetchTripById(tripId) {
		try {
			const docRef = doc(db, 'trips', tripId);
			const docSnap = await getDoc(docRef);
			if (!docSnap.exists()) {
				throw new Error(`Trip with ID ${tripId} does not exist.`);
			}

			const tripData = docSnap.data();
			// Load lines using linesStore
			const linesCollectionRef = collection(docRef, 'lines');
			const linesSnapshot = await getDocs(linesCollectionRef);
			const lines = linesSnapshot.docs.map(lineDoc => ({
				lineId: lineDoc.id,
				...lineDoc.data()
			}));

			const loadedTrip = {
				tripId: docSnap.id,
				...tripData,
				lines
			};

			const index = trips.value.findIndex(t => t.tripId === tripId);
			if (index !== -1) {
				trips.value[index] = loadedTrip;
			} else {
				trips.value.push(loadedTrip);
			}

			trip.value = loadedTrip;
			return loadedTrip;
		} catch (error) {
			const errorOut = `Error fetching trip by ID: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	}

	// Delete a trip and its lines from Firestore and update state
	async function deleteTrip(tripId) {
		try {
			const tripDocRef = doc(db, 'trips', tripId);
			const docSnap = await getDoc(tripDocRef);
			if (!docSnap.exists()) {
				throw new Error(`Trip document ${tripId} does not exist`);
			}
			const linesCollectionRef = collection(db, 'trips', tripId, 'lines');
			const linesSnapshot = await getDocs(linesCollectionRef);
			const batch = writeBatch(db);
			linesSnapshot.docs.forEach(lineDoc => batch.delete(lineDoc.ref));
			batch.delete(tripDocRef);
			await batch.commit();

			const index = trips.value.findIndex(trip => trip.tripId === tripId);
			if (index !== -1) trips.value.splice(index, 1);
			if (trip.value?.tripId === tripId) trip.value = null;
		} catch (error) {
			const errorOut = `Error deleting trip: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	}

	// Delete a line from a trip and update local state
	async function deleteLine(tripId, lineId) {
		await linesStore.deleteLine(tripId, lineId);
		const tripObj = getTripById(tripId);
		if (tripObj) {
			const index = tripObj.lines.findIndex(line => line.lineId === lineId);
			if (index !== -1) {
				tripObj.lines.splice(index, 1);
				tripObj.linesCount = tripObj.lines.length;
			}
		}
	}

	// Load lines for a given trip and update local state
	async function loadLines(tripId) {
		await linesStore.loadLines(tripId);
		const tripObj = getTripById(tripId);
		if (tripObj) {
			tripObj.lines = [...linesStore.lines];
			tripObj.linesCount = tripObj.lines.length;
		}
	}

	return {
		// State
		trips,
		trip,

		// Reset
		$reset,

		// Getters
		hasTrips,
		tripsCount,

		// Actions
		getNewTripId,
		createTrip,
		loadTrips,
		fetchTripById,
		deleteTrip,
		deleteLine,
		loadLines,
		setActiveTrip,
		clearActiveTrip
	};
});
