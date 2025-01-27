<template>
	<div>
		<base-dialog @close="handleError" :show="!!error" title="An error is ocurred!">
			<p>{{ error }}</p>
		</base-dialog>
		<section>
			<base-card>
				<h2>Create User.</h2>
				<div v-if="isLoading">
					<base-spinner></base-spinner>
				</div>
				<user-form @save-data="createUserLocal"></user-form>
			</base-card>
		</section>
	</div>
</template>

<script>
import { cloudFunctions } from '../../firebase.js';
import { httpsCallable } from 'firebase/functions';
import { mapActions } from 'vuex';
import UserForm from '../../components/users/UserForm.vue';


export default {
	name: 'UserCreate',
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
		...mapActions('users', ['userByEmail']),
		async createUserLocal(userData) {
			this.isLoading = true;
			try {
				const userExists = await this.userByEmail(userData.email);
				if (userExists) {
					this.error = `User with email ${userExists.email} already exists!`;
					this.isLoading = false;
					return;
				}
				const createUser = httpsCallable(cloudFunctions, 'createUser');
				await createUser({ user: userData });
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