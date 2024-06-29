import { db } from '../../../firebase.js';
import { collection, doc, getDoc, addDoc, setDoc, updateDoc, deleteDoc, getDocs } from "firebase/firestore";

export default {
	async passedLine(context, payload) {
		const tripId = payload.tripId;
		const lineId = payload.lineId;
		const passed = payload.passed;
		const lineRef = doc(db, "trips", tripId, "lines", lineId);
		await updateDoc(lineRef, { passed: passed });
		context.commit('passedLine', { lineId: lineId, passed: passed});
	},
	async updateLines(context, payload) {
		const tripId = payload.tripId;
		const lines = payload.lines;
		const linesCollectionRef = collection(db, `trips/${tripId}/lines`);
		lines.forEach(async line => {
			const lineRef = doc(linesCollectionRef, line.id);
			await updateDoc(lineRef, line);
		});
		context.commit('updateLines', lines);
	},
	async deleteLine(context, payload) {
		const tripId = payload.tripId;
		const lineId = payload.lineId;
		await deleteDoc(doc(db, "trips", tripId, "lines", lineId));
		context.commit('deleteLine', { lineId: lineId });
	},
	async addLine(context, payload) {
		const tripId = payload.tripId;
		const lineData = {
			order: payload.order,
			name: payload.name,
			tulip: payload.tulip,
			roadNo: payload.roadNo,
			note: payload.note,
			passed: payload.passed,
		};

		const lineRef = collection(db, `trips/${tripId}/lines`);
		const docRef = await addDoc(lineRef, lineData);
		lineData.id = docRef.id;

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
		console.log('action updateTrip payload', payload);
		const tripData = {
			tripId: tripId,
			name: payload.name,
			description: payload.description,
		};
		await setDoc(doc(db, "trips", tripId), tripData);
		context.commit('updateTrip', tripData);
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
		context.commit('loadTrips', trips);
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