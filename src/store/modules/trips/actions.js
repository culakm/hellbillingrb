import { db } from '../../../firebase.js';
import { collection, doc, getDoc, addDoc, setDoc, updateDoc, deleteDoc, getDocs, writeBatch, query, orderBy, limit, startAfter } from "firebase/firestore";

export default {
	async passedLine(context, payload) {
		const tripId = context.state.trip.tripId;
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
			const lineRef = doc(linesCollectionRef, line.lineId);
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
	async getTripNewId() {
		const newDocRef = doc(collection(db, 'trips'));
		return newDocRef.id;
	},
	async addTrip(context, payload) {
		const tripId = payload.tripId;
		const tripData = {
			name: payload.name,
			description: payload.description,
			imageName: payload.imageName,
		};
		await setDoc(doc(db, "trips", tripId), tripData);
		context.commit('addTrip', tripData);
	},
	async updateTrip(context, payload) {
		const tripId = payload.tripId;
		const tripData = {
			tripId: tripId,
			name: payload.name,
			description: payload.description,
			imageName: payload.imageName,
		};
		await setDoc(doc(db, "trips", tripId), tripData);
		context.commit('updateTrip', tripData);
	},
	async deleteTripImage(context, payload) {
		const tripId = payload.tripId;
		const tripRef = doc(db, "trips", tripId);
		try {
			await updateDoc(tripRef, { imageName: null });
		} catch (error) {
			console.error('Error deleting file:', error);
			throw new Error('Failed to delete trip image from firebase database!');
		}
		context.commit('deleteTripImage', { tripId });
	},
	async deleteTrip(context, payload) {
		const tripId = payload.tripId;
		const tripDocRef = doc(db, "trips", tripId);
		const linesCollectionRef = collection(db, "trips", tripId, "lines");
		const linesSnapshot = await getDocs(linesCollectionRef);

		const batch = writeBatch(db);
		linesSnapshot.docs.forEach((lineDoc) => {
			batch.delete(lineDoc.ref);
		});
		batch.delete(tripDocRef);
		await batch.commit();

		context.commit('deleteTrip', { tripId: tripId });
	},
	async loadTrips(context) {
		const trips = [];
		const querySnapshot = await getDocs(collection(db, "trips"));
		querySnapshot.forEach((doc) => {
			const tripData = doc.data();
			const trip = {
				tripId: doc.id,
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
		const direction = "asc";
		const tripsQuery = query(tripsCollectionRef, orderBy("name", direction));
		const querySnapshot = await getDocs(tripsQuery);

		querySnapshot.forEach((doc) => {
			const tripData = doc.data();
			const trip = {
				tripId: doc.id,
				name: tripData.name,
				description: tripData.description,
				imageName: tripData.imageName,
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
				tripId: docSnap.id,
				name: tripData.name,
				description: tripData.description,
				imageName: tripData.imageName,
			};

			// Fetch lines subcollection
			const linesCollectionRef = collection(docRef, 'lines');
			const linesSnapshot = await getDocs(linesCollectionRef);
			const lines = linesSnapshot.docs.map(doc => ({ lineId: doc.id, ...doc.data() }));

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