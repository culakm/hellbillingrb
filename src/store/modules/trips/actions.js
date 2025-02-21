import { db } from '../../../firebase.js';
import { collection, doc, getDoc, addDoc, setDoc, updateDoc, deleteDoc, getDocs, writeBatch, query, orderBy, limit, startAfter } from "firebase/firestore";

export default {
	async getTripNewId() {
		try {
			const newDocRef = doc(collection(db, 'trips'));
			return newDocRef.id;
		} catch (error) {
			const errorOut = `Error generating new trip ID: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	},
	async passedLine(context, payload) {
		try {
			const tripId = context.state.trip.tripId;
			const lineId = payload.lineId;
			const passed = payload.passed;
			const lineRef = doc(db, "trips", tripId, "lines", lineId);
			await updateDoc(lineRef, { passed: passed });
			context.commit('passedLine', { lineId: lineId, passed: passed });
		} catch (error) {
			const errorOut = `Error updating passed line status: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	},
	async updateLines(context, payload) {
		try {
			const tripId = payload.tripId;
			const lines = payload.lines;
			const linesCollectionRef = collection(db, `trips/${tripId}/lines`);
			lines.forEach(async line => {
				const lineRef = doc(linesCollectionRef, line.lineId);
				await updateDoc(lineRef, line);
			});
			context.commit('updateLines', lines);
		} catch (error) {
			const errorOut = `Error updating lines: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	},
	async createLine(context, payload) {
		try {
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
			lineData.lineId = docRef.id;
			context.commit('createLine', lineData);
		} catch (error) {
			const errorOut = `Error creating line: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	},
	async editLine(context, payload) {
		try {
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
		} catch (error) {
			const errorOut = `Error editing line: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	},
	async deleteLine(context, payload) {
		try {
			const tripId = payload.tripId;
			const lineId = payload.lineId;
			await deleteDoc(doc(db, "trips", tripId, "lines", lineId));
			context.commit('deleteLine', { lineId: lineId });
		} catch (error) {
			const errorOut = `Error deleting line: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	},
	async createTrip(context, payload) {
		try {
			const tripId = payload.tripId;
			const tripData = {
				name: payload.name,
				description: payload.description,
				imageName: payload.imageName,
				linesCount: 0,
			};
			await setDoc(doc(db, "trips", tripId), tripData);
			context.commit('createTrip', tripData);
		} catch (error) {
			const errorOut = `Error creating trip: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	},
	async updateTrip(context, payload) {
		try {
			const tripId = payload.tripId;
			const tripData = {
				name: payload.name,
				description: payload.description,
				imageName: payload.imageName,
				linesCount: payload.linesCount,
			};
			await setDoc(doc(db, "trips", tripId), tripData);
			context.commit('updateTrip', tripData);
		} catch (error) {
			const errorOut = `Error updating trip: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	},
	async deleteTrip(context, payload) {
		const tripId = payload.tripId;
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
		context.commit('deleteTrip', { tripId: tripId });
	},
	async updateTripImage(context, payload) {
		try {
			const tripId = payload.tripId;
			const imageName = payload.imageName;
			const tripRef = doc(db, "trips", tripId);
			await setDoc(tripRef, { imageName }, { merge: true });
			context.commit('updateTripImage', { imageName });
		} catch (error) {
			const errorOut = `Error updating trip image: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	},
	async deleteTripImage({ commit }, { tripId }) {
		try {
			const tripRef = doc(db, "trips", tripId);
			await updateDoc(tripRef, { imageName: '' });
			commit('deleteTripImage');
			return tripId; // Useful for chaining or tracking which operation completed
		} catch (error) {
			const errorOut = `Error deleting trip image: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	},
	async loadTrips(context) {
		try {
			const trips = [];
			const querySnapshot = await getDocs(collection(db, 'trips'));
			querySnapshot.forEach((doc) => {
				const tripData = doc.data();
				const trip = {
					tripId: doc.id,
					name: tripData.name,
					description: tripData.description,
					imageName: tripData.imageName,
					linesCount: tripData.linesCount,
				};
				trips.push(trip);
			});
			context.commit('loadTrips', trips);
		} catch (error) {
			const errorOut = `Error loading trips: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	},
	async loadTripsOrdered(context) {
		try {
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
					linesCount: tripData.linesCount,
				};
				trips.push(trip);
			});

			context.commit('loadTrips', trips);
		} catch (error) {
			const errorOut = `Error loading ordered trips: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	},
	async tripById(context, tripId) {
		try {
			const docRef = doc(db, "trips", tripId);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				const tripData = docSnap.data();
				const trip = {
					tripId: docSnap.id,
					name: tripData.name,
					description: tripData.description,
					imageName: tripData.imageName,
					linesCount: tripData.linesCount,
				};

				// Fetch lines subcollection
				const linesCollectionRef = collection(docRef, 'lines');
				const linesSnapshot = await getDocs(linesCollectionRef);
				const lines = linesSnapshot.docs.map(doc => ({ lineId: doc.id, ...doc.data() }));

				// Add lines to trip
				trip.lines = lines;
				context.commit('setTrip', trip);
			} else {
				throw new Error("Can't find trip with id: " + tripId);
			}
		} catch (error) {
			const errorOut = `Error fetching trip by ID: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	},
	async tripByIdReset(context) {
		try {
			context.commit('resetTrip');
		} catch (error) {
			const errorOut = `Error resetting trip: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	}
};