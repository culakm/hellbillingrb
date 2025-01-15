import { db } from '../../../firebase.js';
import { collection, doc, getDoc, addDoc, setDoc, updateDoc, deleteDoc, getDocs, writeBatch, query, orderBy, where, startAfter } from "firebase/firestore";

export default {
	async loadUsers(context) {
		const usersCollectionRef = collection(db, "users");
		const usersQuery = query(usersCollectionRef, orderBy("name", "asc"));
		const querySnapshot = await getDocs(usersQuery);
		const users = [];
		querySnapshot.forEach((doc) => {
			const userData = doc.data();
			const user = {
				userId: doc.id,
				name: userData.name,
				email: userData.email,
				description: userData.description
			};
			users.push(user);
		});
		context.commit('loadUsers', users);
	},
	async addUser(context, payload) {
		const userId = payload.userId;
		const userData = {
			name: payload.name,
			email: payload.email,
			description: payload.description,
		};
		await setDoc(doc(db, "users", userId), userData);
		context.commit('addUser', userData);
	},
	async updateUser(context, payload) {
		const userId = payload.userId;
		const userData = {
			userId: userId,
			name: payload.name,
			description: payload.description,
		};
		await setDoc(doc(db, "users", userId), userData);
		context.commit('updateUser', userData);
	},
	async deleteUser(context, payload) {
		const userId = payload.userId;
		const userDocRef = doc(db, "users", userId);
		const linesCollectionRef = collection(db, "users", userId, "lines");

		// Fetch all documents in the "lines" sub-collection
		const linesSnapshot = await getDocs(linesCollectionRef);

		// Create a batch
		const batch = writeBatch(db);

		// Add delete operations for each document in the "lines" sub-collection to the batch
		linesSnapshot.docs.forEach((lineDoc) => {
			batch.delete(lineDoc.ref);
		});

		// Add delete operation for the user document to the batch
		batch.delete(userDocRef);

		// Commit the batch
		await batch.commit();

		// Commit the mutation to update the state
		context.commit('deleteUser', { userId: userId });
	},
	async userById(context, userId) {
		const docRef = doc(db, "users", userId);
		const docSnap = await getDoc(docRef);
		if (docSnap.exists()) {
			const userData = docSnap.data();
			const user = {
				userId: docSnap.id,
				name: userData.name,
				description: userData.description,
			};
		} else {
			console.log("No such document!");
		}
	},
	async userByEmail(context, email) {
		if (!email) {
			return null;
		}
		try {
			const q = query(
				collection(db, '/users/'),
				where("email", "==", email)
			);

			const querySnapshot = await getDocs(q);
			// querySnapshot.forEach((doc) => { console.log('pako1', doc.id); console.log('pako2', doc.data()); });
			if (!querySnapshot.empty) {
				const userDoc = querySnapshot.docs[0];
				const userData = userDoc.data();
				return {
					userId: userDoc.id,
					name: userData.name,
					email: userData.email,
					description: userData.description
				}
			}
			return null;
		} catch (error) {
			console.error("Error fetching user:", error)
			throw error
		}
	},
	async userByIdReset(context) {
		context.commit('resetUser');
	}
};