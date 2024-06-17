import { db } from '../../../firebase.js';
import { collection, doc, addDoc, deleteDoc, getDocs } from "firebase/firestore";

export default {
	async addTrip(context, payload) {
		const tripData = {
			name: payload.name,
			description: payload.description,
		};
		await addDoc(collection(db, 'trips'), tripData);
		context.commit('addUser', { tripData });
	},
	async updateTrip(context, payload) {
		const tripData = {
			tripId: payload.tripId,
			name: payload.name,
			description: payload.description,
		};
		const token = context.rootGetters.token;
		const response = await fetch(`https://hellbilling1-default-rtdb.europe-west1.firebasedatabase.app/trips/${tripData.tripId}.json?auth=${token}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(tripData)
		});
		const responseData = await response.json();

		if (!response.ok) {
			const error = new Error(`State: coaches, Padlo POST: ${responseData.error} STATUS: ${response.status} (${response.statusText})` || 'Failed to fetch!');
			throw error;
		}

		context.commit('editTrip', tripData);
	},
	async deleteTrip(context, payload) {
		const tripId = payload.tripId;
		const token = context.rootGetters.token;
		const response = await fetch(`https://hellbilling1-default-rtdb.europe-west1.firebasedatabase.app/trips/${tripId}.json?auth=${token}`, {
			method: 'DELETE',
		});
		const responseData = await response.json();

		if (!response.ok) {
			const error = new Error(`State: coaches, Padlo DELETE: ${responseData.error} STATUS: ${response.status} (${response.statusText})` || 'Failed to fetch!');
			throw error;
		}

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
		console.log('trips', trips);
		context.commit('setTrips', trips);
	}
};