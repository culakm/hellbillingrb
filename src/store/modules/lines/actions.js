import { db } from '../../../firebase.js';
import { collection, doc, addDoc, setDoc, deleteDoc, getDocs } from "firebase/firestore";

export default {
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
	}
};