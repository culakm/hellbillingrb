<template>
	<div>
		<base-dialog @close="handleError" :show="!!error" title="An error is ocurred!">
			<p>{{ error }}</p>
		</base-dialog>
		<section>
			<base-card>
				<h2>Add User.</h2>
				<div v-if="isLoading">
					<base-spinner></base-spinner>
				</div>
				<user-form @save-data="addUserLocal"></user-form>
			</base-card>
		</section>
	</div>
</template>

<script>
import { cloudFunctions } from '../../firebase.js';
import { httpsCallable } from 'firebase/functions';
import UserForm from '../../components/users/UserForm.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
	name: 'UserAdd',
	components: {
		UserForm,
	},
	data() {
		return {
			isLoading: false,
			error: null,
		};
	},
	methods: {
		...mapActions({
			authAddUser: 'addUser', //vyhodit
			usersAddUser: 'users/addUser', //vyhodit
			userByEmail: 'users/userByEmail',
		}),
		async addUserLocal(userData) {
			this.isLoading = true;
			console.log('userData na clientovi', userData);
			try {
				const userExists = await this.userByEmail(userData.email);
				if (userExists) {
					this.error = `User with email ${userExists.email} already exists!`;
					this.isLoading = false;
					return;
				}
				const createUser = httpsCallable(cloudFunctions, 'createUser');
				const result = await createUser({ user: userData });
			} catch (error) {
				this.error = `User was not created! ${error}`;
				this.isLoading = false;
				return;
			}

			this.isLoading = false;
			this.$router.replace('/users');
		},
		handleError() {
			this.error = null;
		},
		async addUserLocalExpress(userData) {
			this.isLoading = true;
			try {
				console.log('userData', userData);
				const userExists = await this.userByEmail(userData.email);
				if (userExists) {
					this.error = `User with email ${userExists.email} already exists!`;
					this.isLoading = false;
					return;
				}

				const url = 'http://127.0.0.1:5001/hellbillingrb/us-central1/createUserExpress';
				const options = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ user: userData }),
				};
				const response = await fetch(url, options);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data = await response.json();
				console.log(data.message);
				// await this.usersAddUser(userData);
			} catch (error) {
				this.error = `Component ${this.$options.name}, Padlo fetch : ${error.message}` || 'Something went wrong!';
				return;
			}

			this.isLoading = false;
			this.$router.replace('/users');
		},
		handleError() {
			this.error = null;
		},
	},
};
</script>