import { db } from '../../../firebase.js';
import { collection, doc, getDoc, addDoc, setDoc, updateDoc, deleteDoc, getDocs, writeBatch, query, orderBy, where } from "firebase/firestore";

function sortLines(lines) {
  lines.sort((a, b) => a.order - b.order);
}

function reaclculateLineExtraValues(state) {
  const lines = state.trip.lines;
  lines.forEach((line, index) => {
    line.kmPart = null;
    if (index === 0) {
      line.kmPart = 0;
    } else {
      let previousKmTotal = null;
      for (let i = index - 1; i >= 0; i--) {
        if (lines[i].kmTotal !== null) {
          previousKmTotal = lines[i].kmTotal;
          break;
        }
      }
      if (line.kmTotal !== null && previousKmTotal !== null) {
        line.kmPart = parseFloat((line.kmTotal - previousKmTotal).toFixed(2));
      }
    }
    line.interest.forEach(value => {
      line[value] = true;
    });
    if (!line.close) {
      line.close = false;
    }
    const nextLine = lines[index + 1];
    if (index < lines.length - 1 && line.kmTotal !== null && nextLine.kmTotal !== null) {
      if (nextLine.kmTotal - line.kmTotal < 2) {
        line.close = true;
      }
    }
  });
}

export default {
  namespaced: true,

  state() {
    return {
      trips: [],
      trip: null,
    };
  },

  mutations: {
    passedLine(state, payload) {
      const lineId = payload.lineId;
      const passed = payload.passed;
      const line = state.trip.lines.find(line => line.lineId === lineId);
      line.passed = passed;
    },
    updateLines(state, payload) {
      state.trip.lines = payload;
    },
    createLine(state, payload) {
      state.trip.linesCount++;
      state.trip.lines.push(payload);
      sortLines(state.trip.lines);
      reaclculateLineExtraValues(state);
    },
    updateLine(state, payload) {
      const line = state.trip.lines.find(line => line.lineId === payload.lineId);
      line.name = payload.name;
      line.kmTotal = payload.kmTotal;
      line.tulip = payload.tulip;
      line.mapPage = payload.mapPage;
      line.roadNo = payload.roadNo;
      line.interest = payload.interest;
      line.stop = payload.stop;
      line.note = payload.note;
      reaclculateLineExtraValues(state);
    },
    deleteLine(state, payload) {
      state.trip.linesCount--;
      const lineId = payload.lineId;
      const lineIndex = state.trip.lines.findIndex(line => line.lineId === lineId);
      state.trip.lines.splice(lineIndex, 1);
      state.trip.lines.forEach((line, index) => {
        line.order = index + 1;
      });
    },
    createTrip(state, payload) {
      state.trips.push(payload);
      sortLines(state.trips);
    },
    updateTrip(state, payload) {
      const trip = state.trip;
      trip.name = payload.name;
      trip.description = payload.description;
      trip.imageName = payload.imageName;
      trip.linesCount = payload.linesCount;
    },
    deleteTrip(state, payload) {
      const tripId = payload.tripId;
      const tripIndex = state.trips.findIndex(trip => trip.tripId === tripId);
      state.trips.splice(tripIndex, 1);
    },
    updateTripImage(state, payload) {
      const trip = state.trip;
      if (trip) {
        trip.imageName = payload.imageName;
      }
    },
    deleteTripImage(state, payload) {
      const trip = state.trip;
      trip.imageName = '';
    },
    loadTrips(state, payload) {
      state.trips = payload;
      state.trip = null;
    },
    setTrip(state, payload) {
      state.trip = payload;
      if (state.trip.lines) {
        sortLines(state.trip.lines);
        reaclculateLineExtraValues(state);
      }
    },
    resetTrip(state) {
      state.trip = undefined;
    },
  },

  actions: {
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
          mapPage: payload.mapPage,
          roadNo: payload.roadNo,
          interest: payload.interest,
          stop: payload.stop,
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
          mapPage: payload.mapPage,
          roadNo: payload.roadNo,
          interest: payload.interest,
          stop: payload.stop,
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
          userId: payload.userId,
          tripId: tripId,
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
        return tripId;
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
            userId: tripData.userId,
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
            userId: tripData.userId,
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

    async loadTripsOrderedByUserId({commit}, {userId}) {
      try {
        const trips = [];
        const tripsCollectionRef = collection(db, "trips");
        const direction = "asc";
        const tripsQuery = query(tripsCollectionRef, orderBy("name", direction), where("userId", "==", userId));
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
          trips.push(trip);
        });
        commit('loadTrips', trips);
      } catch (error) {
        const errorOut = `Error loading ordered trips by user ID: ${error.message}`;
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
            userId: tripData.userId,
            name: tripData.name,
            description: tripData.description,
            imageName: tripData.imageName,
            linesCount: tripData.linesCount,
          };
          const linesCollectionRef = collection(docRef, 'lines');
          const linesSnapshot = await getDocs(linesCollectionRef);
          const lines = linesSnapshot.docs.map(doc => ({ lineId: doc.id, ...doc.data() }));
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
    },
  },

  getters: {
    trips(state) {
      return state.trips;
    },
    trip(state) {
      return state.trip;
    },
    hasTrips(state) {
      return state.trips && state.trips.length > 0;
    },
    hasLines(state) {
      return state.trip && state.trip.linesCount && state.trip.linesCount > 0;
    },
  },
};
