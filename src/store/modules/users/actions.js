import { db } from '../../../firebase.js';
import { collection, doc, getDoc, setDoc, getDocs, query, orderBy, where } from "firebase/firestore";
import { cloudFunctions } from '../../../firebase.js';
import { httpsCallable } from 'firebase/functions';

const _getUserRole = async (email) => {
	const getUserRole = httpsCallable(cloudFunctions, 'getUserRole');
	const roleResult = await getUserRole({ email });
	return roleResult.data.role;
};

export default {
	async loadUsers(context) {
		try {
			const usersCollectionRef = collection(db, "users");
			const usersQuery = query(usersCollectionRef, orderBy("name", "asc"));
			const querySnapshot = await getDocs(usersQuery);
			const users = [];

			for (const doc of querySnapshot.docs) {
				const userData = doc.data();
				let role;
				try {
					role = await _getUserRole(userData.email);
				} catch (roleError) {
					console.error(`Error fetching role for user ${userData.email}:`, roleError);
					throw roleError;
				}
				const user = {
					userId: doc.id,
					name: userData.name,
					email: userData.email,
					description: userData.description,
					role: role
				};
				users.push(user);
			}

			context.commit('loadUsers', users);
		} catch (error) {
			console.error("Error loading users:", error);
			throw error;
		}
	},
	async deleteUser(context, payload) {
		const userId = payload.userId;
		context.commit('deleteUser', { userId: userId });
	},
	async userByIdFB(context, userId) {
		if (!userId) { return null; }
		try {
			const docRef = doc(db, "users", userId);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				const userData = docSnap.data();
				const role = await _getUserRole(userData.email);
				return {
					userId: userId,
					name: userData.name,
					email: userData.email,
					description: userData.description,
					role: role
				};
			}
			return null;
		} catch (error) {
			console.error("Error fetching user:", error);
			throw error;
		}
	},
	async userByIdStore(context, userId) {
		if (!userId) { return null; }
		try {
			const user = context.state.users.find(user => user.userId === userId);
			if (user) {
				return {
					userId: user.userId,
					name: user.name,
					email: user.email,
					description: user.description,
					role: user.role
				};
			}
			return null;
		} catch (error) {
			console.error("Error fetching user from store:", error);
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
				const role = await _getUserRole(userData.email);
				return {
					userId: userDoc.id,
					name: userData.name,
					email: userData.email,
					description: userData.description,
					role: role
				};
			}
			return null;
		} catch (error) {
			console.error("Error fetching user:", error);
			throw error;
		}
	}
};