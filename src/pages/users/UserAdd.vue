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
		}
	},
};
</script>