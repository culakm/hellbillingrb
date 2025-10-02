import { ref,computed, watch, watchEffect } from 'vue';
import { defineStore } from 'pinia';
import { db } from '../firebase.js';
import { collection, getDoc, getDocs, setDoc, query, orderBy, doc, writeBatch  } from "firebase/firestore";
import { useLinesStore } from '@/stores/lines';

export const useTripsStore = defineStore('trips', () => {
	// states
	const trips = ref([]);
	const counter = ref(0);
	const pako1 = ref(1);
	const pako2 = ref('startovacia hodnota: nejaka hovadina ale este to pokracuje');
	const pako3 = ref('');

	function $reset() {
		trips.value = [];
		counter.value = 0;
		pako1.value = 1;
		pako2.value ='startovacia hodnota: nejaka hovadina ale este to pokracuje';
		pako3.value = '';
	}
	// getters
	const doubleCounter = computed(() => counter.value * 2);
	const doublePlusOne = computed(() => doubleCounter.value + 1);
	// getter ako funkcia s parametrom
	const pako2Filtered = (searchString) => { return pako2.value.includes(searchString) ? 1 : 0; };

	const hasTrips = computed(() => trips.value.length > 0);
	const tripsCount = computed(() => trips.value.length);

	function incrementCounter() {
		counter.value++;
	}

	async function getTripNewId() {
		try {
			const newDocRef = doc(collection(db, 'trips'));
			return newDocRef.id;
		} catch (error) {
			const errorOut = `Error generating new trip ID: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	}

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
	async function createTrip(tripId, name) {
		try {
			const tripData = {
				// userId: payload.userId,
				tripId: tripId,
				name: name,
				description: 'default description',
				imageName: '',
				linesCount: 0,
			};
			await setDoc(doc(db, "trips", tripId), tripData);
			trips.value.push(tripData);
		} catch (error) {
			const errorOut = `Error creating trip: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	}

  	async function loadTrips() {
		try {
			const loadedTrips = []; // !!
			const querySnapshot = await getDocs(collection(db, 'trips'));
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
				loadedTrips.push(trip); // !!
			});
			trips.value = loadedTrips; // !!
		} catch (error) {
			const errorOut = `Error loading trips: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	}

	async function loadTripsOrdered() {
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
			console.log('Trips loaded and ordered by name.' , trips);
		} catch (error) {
			const errorOut = `Error loading ordered trips: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	}

	async function loadLines3(tripId) {

		const linesStore = useLinesStore();
		linesStore.setTripId(tripId);
console.log("tripsStore, loadLines2: Starting Loading lines for tripId:", tripId);
		const trip = trips.value.find((t) => t.tripId === tripId);
		// Add lines to the trip object
		watchEffect(() => console.log("tripsStore, loadLines2: linesStore.lines.value:", linesStore.lines));
		trip.lines = linesStore.lines;

		// Update the Pinia store
		trips.value = trips.value.map((t) =>
			t.tripId === tripId ? trip : t
		);

		watchEffect(() => console.log("tripsStore, loadLines2: Trip lines loaded into trips:", trips.value));

	}

	async function loadLines4(tripId) {

		const linesStore = useLinesStore();
		linesStore.setTripId(tripId);
console.log("tripsStore, loadLines2: Starting Loading lines for tripId:", tripId);
		const trip = trips.value.find((t) => t.tripId === tripId);
		// Add lines to the trip object
		console.log("tripsStore, loadLines2: linesStore.lines.value:", linesStore.lines);
		trip.lines = linesStore.lines;

		// Update the Pinia store
		trips.value = trips.value.map((t) =>
			t.tripId === tripId ? trip : t
		);

		console.log("tripsStore, loadLines2: Trip lines loaded into trips:", trips.value);

	}


async function loadLines2(tripId) {
  const linesStore = useLinesStore();
  linesStore.setTripId(tripId);
  console.log("Starting to load lines for ----------------------- tripId:", tripId);

  const trip = trips.value.find((t) => t.tripId === tripId);

  // Set a watcher that reacts whenever linesStore.lines updates
  const unwatch = watch(
    () => linesStore.lines,
    (newLines) => {
		if (newLines.length > 0) { // lines loaded
		trip.lines = newLines;
		trips.value = trips.value.map((t) => (t.tripId === tripId ? trip : t));
		unwatch();
		}
	},
    {
      immediate: false, // Run only on change
    }
  );
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

				// Fetch lines subcollection
				const linesCollectionRef = collection(docRef, "lines");
				const linesSnapshot = await getDocs(linesCollectionRef);
				const lines = linesSnapshot.docs.map((doc) => ({
					lineId: doc.id,
					...doc.data(),
				}));

				// Add lines to the trip object
				trip.lines = lines;

				// Update the Pinia store
				trips.value = trips.value.map((t) =>
					t.tripId === tripId ? trip : t
				);

				// console.log('Trip lines fetched:', lines);

				console.log("Trip fetched by ID:", trip);
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
		counter,
		pako1,
		pako2,
		pako3,
		// getters
		doubleCounter,
		doublePlusOne,
		pako2Filtered,
		hasTrips,
		tripsCount,
		// actions
		incrementCounter,
		getTripNewId,
		deleteTrip,
		createTrip,
		loadTrips,
		loadTripsOrdered,
		fetchTripById,
		loadLines2,
		// extra
		$reset,

	};
});