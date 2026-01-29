import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { db } from "../firebase.js";
import { interestNames, closeLineThresholdKm } from "@/config/settings";
import { collection, doc, getDocs, updateDoc, setDoc, deleteDoc, query, orderBy } from "firebase/firestore";

export const useLinesStore = defineStore("lines", () => {
	// State
	const lines = ref([]);
	const tripId = ref(undefined);

	// Reset state
	const $reset = () => {
		lines.value = [];
		tripId.value = undefined;
	};

	// Getters
	const linesCount = computed(() => lines.value.length);

	// Actions
	const getNewLineId = async (localTripId) => {
		try {
			if (!localTripId) {
				throw new Error("Trip ID is required to generate a new line ID.");
			}
			const newDocRef = doc(collection(db, "trips", localTripId, "lines"));
			return newDocRef.id;
		} catch (error) {
			const errorOut = `Error generating new line ID for trip ID ${localTripId}: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	};

	const getLinesForTrip = (requestedTripId) => {
		if (tripId.value === requestedTripId) {
			return lines.value;
		}
		return [];
	};

	const loadLines = async (localTripId) => {
		try {
			const docRef = doc(db, "trips", localTripId);
			const linesCollectionRef = collection(docRef, "lines");
			const linesQuery = query(linesCollectionRef, orderBy("order"));
			const querySnapshot = await getDocs(linesQuery);

			const loadedLines = querySnapshot.docs.map((docSnap) => ({
				lineId: docSnap.id,
				...docSnap.data(),
			}));

			lines.value = loadedLines;
			tripId.value = localTripId;
			sortLines();
			recalculateLineExtraValues();
		} catch (error) {
			const errorOut = `Error fetching lines for trip ID ${localTripId}: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	};

	const updateLines = async (newLines, localTripId) => {
		try {
			const linesCollectionRef = collection(db, `trips/${localTripId}/lines`);
			newLines.forEach(async (line) => {
				const lineRef = doc(linesCollectionRef, line.lineId);
				await updateDoc(lineRef, line);
			});
			lines.value = newLines;
			sortLines();
			recalculateLineExtraValues();
		} catch (error) {
			const errorOut = `Error updating lines: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	};

	const createLine = async (lineData) => {
		try {
			const lineId = await getNewLineId(lineData.tripId);
			lineData.lineId = lineId;
			await setDoc(doc(db, `trips/${lineData.tripId}/lines`, lineId), lineData);

			if (tripId.value === lineData.tripId) {
				lines.value.push(lineData);
				sortLines();
				recalculateLineExtraValues();
			}
		} catch (error) {
			const errorOut = `Error creating line: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	};

	const editLine = async (lineData) => {
		try {
			await setDoc(doc(db, `trips/${lineData.tripId}/lines/`, lineData.lineId), lineData);

			const index = lines.value.findIndex((line) => line.lineId === lineData.lineId);

			if (index !== -1) {
				lines.value.splice(index, 1, { ...lines.value[index], ...lineData });
			}

			sortLines();
			recalculateLineExtraValues();
		} catch (error) {
			const errorOut = `Error editing line: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	};

	const deleteLine = async (localTripId, localLineId) => {
		try {
			await deleteDoc(doc(db, "trips", localTripId, "lines", localLineId));

			console.log(`Deleted line with ID ${localLineId} from trip ID ${localTripId}`);
			if (tripId.value === localTripId) {
				console.log(`Removing line with ID ${localLineId} from local store`);
				lines.value = lines.value.filter((line) => line.lineId !== localLineId);
				console.log(`Line with ID ${localLineId} removed. Recalculating line values.`);
				console.log(`Current lines:`, lines.value);
				sortLines();
				recalculateLineExtraValues();
			}
		} catch (error) {
			const errorOut = `Error deleting line: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	};

	const passedLine = async (localLineId, localPassed) => {
		try {
			const lineRef = doc(db, "trips", tripId.value, "lines", localLineId);
			await updateDoc(lineRef, { passed: localPassed });

			const line = lines.value.find((l) => l.lineId === localLineId);
			if (line) line.passed = localPassed;
		} catch (error) {
			const errorOut = `Error updating passed line status: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	};

	const sortLines = () => {
		lines.value.sort((a, b) => a.order - b.order);
	};

	const recalculateLineExtraValues = () => {
		lines.value.forEach((line, index) => {
			// kmPart calculation
			line.kmPart = null;
			if (index === 0) {
				line.kmPart = 0;
			} else {
				let previousKmTotal = null;
				for (let i = index - 1; i >= 0; i--) {
					if (lines.value[i].kmTotal !== null) {
						previousKmTotal = lines.value[i].kmTotal;
						break;
					}
				}
				if (line.kmTotal !== null && previousKmTotal !== null) {
					line.kmPart = parseFloat((line.kmTotal - previousKmTotal).toFixed(2));
				}
			}

			// interest calculation
			interestNames.forEach((name) => {
				line[name] = false;
			});
			line.interest.forEach((value) => {
				line[value] = true;
			});

			// close line calculation
			line.close = false;
			const nextLine = lines.value[index + 1];
			if (index < lines.value.length - 1 && line.kmTotal !== null && nextLine?.kmTotal !== null) {
				if (nextLine.kmTotal - line.kmTotal < closeLineThresholdKm) {
					line.close = true;
				}
			}

			// order recalculation
			line.order = index + 1;
		});
	};

	return {
		// State
		tripId,
		lines,

		// Reset
		$reset,

		// Getters
		linesCount,

		// Actions
		getLinesForTrip,
		loadLines,
		updateLines,
		createLine,
		editLine,
		deleteLine,
		passedLine,
	};
});
