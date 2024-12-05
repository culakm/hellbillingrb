import { db } from '../../../firebase.js';
import { collection, doc, getDoc, addDoc, setDoc, updateDoc, deleteDoc, getDocs, writeBatch, query, orderBy, limit, startAfter } from "firebase/firestore";

export default {
	async passedLine(context, payload) {
		const tripId = context.state.trip.id;
		const lineId = payload.lineId;
		const passed = payload.passed;
		const lineRef = doc(db, "trips", tripId, "lines", lineId);
		await updateDoc(lineRef, { passed: passed });
		context.commit('passedLine', { lineId: lineId, passed: passed });
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
			kmTotal: payload.kmTotal,
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
	async editLine(context, payload) {
		const tripId = payload.tripId;
		const lineId = payload.lineId;
		const lineData = {
			lineId: lineId,
			order: payload.order,
			name: payload.name,
			kmTotal: payload.kmTotal,
			tulip: payload.tulip,
			roadNo: payload.roadNo,
			note: payload.note,
			passed: payload.passed,
		};
		await setDoc(doc(db, `trips/${tripId}/lines/`, lineId), lineData);
		context.commit('updateLine', lineData);
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
			tripId: tripId,
			name: payload.name,
			description: payload.description,
		};
		await setDoc(doc(db, "trips", tripId), tripData);
		context.commit('updateTrip', tripData);
	},
	async deleteTrip(context, payload) {
		const tripId = payload.tripId;
		const tripDocRef = doc(db, "trips", tripId);
		const linesCollectionRef = collection(db, "trips", tripId, "lines");

		// Fetch all documents in the "lines" sub-collection
		const linesSnapshot = await getDocs(linesCollectionRef);

		// Create a batch
		const batch = writeBatch(db);

		// Add delete operations for each document in the "lines" sub-collection to the batch
		linesSnapshot.docs.forEach((lineDoc) => {
			batch.delete(lineDoc.ref);
		});

		// Add delete operation for the trip document to the batch
		batch.delete(tripDocRef);

		// Commit the batch
		await batch.commit();

		// Commit the mutation to update the state
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
	async loadTripsOrdered(context) {
		const trips = [];
		const tripsCollectionRef = collection(db, "trips");
		const direction = "asc"; // or "desc"
		// s limitom, offset chce nieco viac
		// const tripsQuery = query(tripsCollectionRef, orderBy("name", direction), limit(2));
		const tripsQuery = query(tripsCollectionRef, orderBy("name", direction));
		const querySnapshot = await getDocs(tripsQuery);

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
	},
	async tripByIdReset(context) {
		context.commit('resetTrip');
	}
};