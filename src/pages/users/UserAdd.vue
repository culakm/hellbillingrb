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
			authAddUser: 'addUser',
			createUserWithoutLogin: 'createUserWithoutLogin',
			usersAddUser: 'users/addUser'
		}),

		async addUserLocal(userData) {
			this.isLoading = true;
			try {
				console.log('userData', userData);
				// kontrola ci uzivatel s danym emailom uz neexistuje
				const userDataRet = await this.$store.dispatch('users/userByEmail', userData.email);
				console.log('user', userDataRet);
				if (userDataRet) {
					this.error = `User with email ${userDataRet.email} already exists!`;
					this.isLoading = false;
					return;
				}
				// const userId = await this.$store.dispatch('addUser', userData);
				// const userId = await this.authAddUser(userData);
				const userId = await this.createUserWithoutLogin(userData);
				console.log('createUserWithoutLogin vratilo: ', userId);
				userData.userId = userId;

				// await this.$store.dispatch('users/addUser', userData);
				await this.usersAddUser(userData);
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