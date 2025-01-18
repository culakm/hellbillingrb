import { db } from '../../../firebase.js';
import { collection, doc, getDoc, setDoc, getDocs, query, orderBy, where } from "firebase/firestore";

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
		// Commit the mutation to update the state
		context.commit('deleteUser', { userId: userId });
	},
	async userById(context, userId) {
		if (!userId) { return null; }
		try {
			const docRef = doc(db, "users", userId);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				const userDoc = docSnap.docs[0];
				const userData = docSnap.data();
				return {
					userId: userDoc.id,
					name: userData.name,
					email: userData.email,
					description: userData.description,
				};
			}
			return null;
		} catch (error) {
			console.error("Error fetching user:", error)
			throw error;

		}
	},
	async userByEmail(context, email) {
		if (!email) { return null; }
		try {
			const q = query(
				collection(db, '/users/'),
				where("email", "==", email)
			);
			const querySnapshot = await getDocs(q);
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
			throw error;
		}
	}
};