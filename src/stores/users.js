import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { db } from "../firebase.js";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { cloudFunctions } from "../firebase.js";
import { httpsCallable } from "firebase/functions";

const _getUserRole = async (email) => {
	try {
		const getUserRole = httpsCallable(cloudFunctions, "getUserRole");
		const roleResult = await getUserRole({ email });
		return roleResult.data.role;
	} catch (error) {
		const errorOut = `Error fetching user role: ${error.message}`;
		console.error(errorOut);
		throw new Error(errorOut);
	}
};

export const useUsersStore = defineStore("users", () => {

	// State
	const users = ref([]);
	const activeUser = ref(null);

	// Reset state
	const $reset = () => {
		users.value = [];
		activeUser.value = null;
	};

	// Getters
	const hasUsers = computed(() => users.value.length > 0);
	const usersCount = computed(() => users.value.length);

	// Actions
	const loadUsers = async () => {
		try {
			users.value = [];
			const usersCollectionRef = collection(db, "users");
			const usersQuery = query(usersCollectionRef, orderBy("name", "asc"));
			const querySnapshot = await getDocs(usersQuery);

			const userPromises = querySnapshot.docs.map(async (doc) => {
				const userData = doc.data();
				try {
					const role = await _getUserRole(userData.email);
					return {
						...userData,
						userId: doc.id,
						role,
					};
				} catch (error) {
					console.error(`Error fetching role for user ${userData.email}: ${error.message}`);
					throw error;
				}
			});
			users.value = await Promise.all(userPromises);
		} catch (error) {
			console.error(`Error loading users: ${error.message}`);
			throw new Error(`Error loading users: ${error.message}`);
		}
	};

	const createUser = async (userData) => {
		try {
			const createUserFn = httpsCallable(cloudFunctions, "createUser");
			const cloudFunctionData = await createUserFn({ user: userData });
			userData.userId = cloudFunctionData.data.userId;
			users.value.push(userData);
			users.value.sort((a, b) => a.name.localeCompare(b.name));
		} catch (error) {
			const errorOut = `Error creating users: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	};

	const updateUser = async (userData) => {
		try {
			const updateUserFn = httpsCallable(cloudFunctions, "updateUser");
			await updateUserFn({ user: userData });
			const index = users.value.findIndex((user) => user.userId === userData.userId);
			if (index !== -1) {
				users.value.splice(index, 1, { ...users.value[index], ...userData });
			}
			users.value.sort((a, b) => a.name.localeCompare(b.name));
		} catch (error) {
			const errorOut = `Error updating user: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	};

	const deleteUser = async (userId) => {
		try {
			const deleteUserFn = httpsCallable(cloudFunctions, "deleteUser");
			await deleteUserFn({ userId: userId });
			users.value = users.value.filter((user) => user.userId !== userId);
		} catch (error) {
			const errorOut = `Error deleting user: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	};

	const userByEmail = async (email) => {
		if (!email) {
			return null;
		}
		try {
			const userQuery = query(collection(db, "/users/"), where("email", "==", email));
			const querySnapshot = await getDocs(userQuery);
			if (!querySnapshot.empty) {
				const userDoc = querySnapshot.docs[0];
				const userData = userDoc.data();
				const role = await _getUserRole(userData.email);
				return {
					...userData,
					role,
				};
			}
			return null;
		} catch (error) {
			const errorOut = `Error fetching user by email: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	};

	const userById = async (userId) => {
		if (!userId) {
			return null;
		}
		if (!hasUsers.value) {
			await loadUsers();
		}
		try {
			const user = users.value.find((user) => user.userId === userId);
			return user ? { ...user } : undefined;
		} catch (error) {
			const errorOut = `Error fetching user by ID from store: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	};

	return {
		// State
		users,
		activeUser,

		// Reset
		$reset,

		// Getters
		hasUsers,
		usersCount,

		// Actions
		loadUsers,
		createUser,
		updateUser,
		deleteUser,
		userByEmail,
		userById,
	};
});
