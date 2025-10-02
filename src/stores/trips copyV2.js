import { ref,computed } from 'vue';
import { defineStore } from 'pinia';
import { db } from '../firebase.js';
import { collection, getDoc, getDocs, setDoc, query, orderBy, doc, writeBatch  } from "firebase/firestore";
import { useLinesStore } from '@/stores/lines';

export const useTripsStore = defineStore('trips', () => {
	const linesStore = useLinesStore();

	// states
	const trips = ref([]);

	function $reset() {
		trips.value = [];
	}

	// getters
	const hasTrips = computed(() => trips.value.length > 0);
	const tripsCount = computed(() => trips.value.length);

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

	// actions
	async function deleteTrip(tripId) {
		try {

			const tripDocRef = doc(db, "trips", tripId);
			const docSnap = await getDoc(tripDocRef);
			if (!docSnap.exists()) {
				throw new Error(`Trip document ${tripId} does not exist`);
			}
			const linesCollectionRef = collection(db, "trips", tripId, "lines");
			const linesSnapshot = await getDocs(linesCollectionRef);

			const batch = writeBatch(db);
			linesSnapshot.docs.forEach((lineDoc) => {
				batch.delete(lineDoc.ref);
			});
			batch.delete(tripDocRef);
			await batch.commit();

		} catch (error) {
			const errorOut = `Error deleting trip: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
		const tripIndex = trips.value.findIndex(trip => trip.tripId === tripId); // Use trips.value
		if (tripIndex !== -1) {
			trips.value.splice(tripIndex, 1); // Use trips.value
		}
	}
	async function createTrip(name) {
		try {
		  const tripId = await getNewTripId(); // Call internal method for ID
		  const tripData = {
			tripId,
			name,
			description: 'default description',
			imageName: '',
			linesCount: 0,
			lines: [],
		  };
		  await setDoc(doc(db, "trips", tripId), tripData);
		  trips.value = [...trips.value, {...tripData}];
		} catch (error) {
		  const errorOut = `Error creating trip: ${error.message}`;
		  console.error(errorOut);
		  throw new Error(errorOut);
		}
	}

	async function loadTrips() {
		try {
			const loadedTrips = [];
			const tripsCollectionRef = collection(db, "trips");
			const direction = "asc";
			const tripsQuery = query(tripsCollectionRef, orderBy("name", direction));
			const querySnapshot = await getDocs(tripsQuery);

			querySnapshot.forEach((doc) => {
				const tripData = doc.data();
				const trip = {
					tripId: doc.id,
					userId: tripData.userId,
					name: tripData.name,
					description: tripData.description,
					imageName: tripData.imageName,
					linesCount: tripData.linesCount,
				};
				loadedTrips.push(trip);
			});
			trips.value = loadedTrips;
		} catch (error) {
			const errorOut = `Error loading ordered trips: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	}

	async function deleteLine(tripId, lineId) {
		console.log(`Deleting line ${lineId} from trip ${tripId} in trips store`);
		await linesStore.deleteLine(tripId, lineId);
		const trip = trips.value.find((t) => t.tripId === tripId);
		if (trip) {
			const lineIndex = trip.lines.findIndex((line) => line.lineId === lineId);
			if (lineIndex !== -1) {
				trip.lines.splice(lineIndex, 1);
				trip.linesCount = trip.lines.length;
				trips.value = trips.value.map((t) =>
					t.tripId === tripId ? trip : t
				);
			}
		}
	}

	async function loadLines(tripId) {
		await linesStore.loadLines(tripId);
		const trip = trips.value.find((t) => t.tripId === tripId);
		trip.lines = linesStore.lines;
		trips.value = trips.value.map((t) => (t.tripId === tripId ? trip : t));
	}

	async function fetchTripById(tripId) {
		try {
			const docRef = doc(db, "trips", tripId);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				const tripData = docSnap.data();
				const trip = {
					tripId: docSnap.id,
					userId: tripData.userId,
					name: tripData.name,
					description: tripData.description,
					imageName: tripData.imageName,
					linesCount: tripData.linesCount,
				};

				const linesCollectionRef = collection(docRef, "lines");
				const linesSnapshot = await getDocs(linesCollectionRef);
				const lines = linesSnapshot.docs.map((doc) => ({
					lineId: doc.id,
					...doc.data(),
				}));

				trip.lines = lines;

				trips.value = trips.value.map((t) =>
					t.tripId === tripId ? trip : t
				);
				return trip;
			} else {
				throw new Error(`Trip with ID ${tripId} does not exist.`);
			}
		} catch (error) {
			const errorOut = `Error fetching trip by ID: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	}

	return {
		// states
		trips,
		// getters
		hasTrips,
		tripsCount,
		// actions
		getNewTripId,
		deleteTrip,
		createTrip,
		loadTrips,
		fetchTripById,
		deleteLine,
		loadLines,
		// extra
		$reset,

	};
});