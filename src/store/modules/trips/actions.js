import { db } from '../../../firebase.js';
import { collection, doc, getDoc, addDoc, setDoc, updateDoc, deleteDoc, getDocs } from "firebase/firestore";

export default {
	async addLine(context, payload) {
		const tripId = payload.tripId;
		const lineData = {
			name: payload.name,
			note: payload.note,
		};

		const lineRef = doc(collection(db, `trips/${tripId}/lines`));
		await setDoc(lineRef, lineData);
		context.commit('addLine', lineData);
	},
	async addTrip(context, payload) {
		const tripData = {
			name: payload.name,
			description: payload.description,
		};
		await addDoc(collection(db, 'trips'), tripData);
		context.commit('addTrip', tripData);
	},
	async updateTrip(context, payload) {
		const tripId = payload.tripId;
		const tripData = {
			name: payload.name,
			description: payload.description,
		};

		await setDoc(doc(db, "trips", tripId), tripData);
		context.commit('editTrip', tripData);
	},
	async deleteTrip(context, payload) {
		const tripId = payload.tripId;
		await deleteDoc(doc(db, "trips", tripId));
		context.commit('deleteTrip', { tripId: tripId });
	},
	async loadTrips(context) {
		const trips = [];
		const querySnapshot = await getDocs(collection(db, "trips"));
		querySnapshot.forEach((doc) => {
			const tripData = doc.data();
			const trip = {
				id: doc.id,
				name: tripData.name,
				description: tripData.description,
			};
			trips.push(trip);
		});
		context.commit('setTrips', trips);
	},
	async tripById(context, tripId) {
		const docRef = doc(db, "trips", tripId);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			const tripData = docSnap.data();
			const trip = {
				id: docSnap.id,
				name: tripData.name,
				description: tripData.description,
			};

			// Fetch lines subcollection
			const linesCollectionRef = collection(docRef, 'lines');
			const linesSnapshot = await getDocs(linesCollectionRef);
			const lines = linesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

			// Add lines to trip
			trip.lines = lines;
			context.commit('setTrip', trip);
		} else {
			console.log("No such document!");
		}
	}
};