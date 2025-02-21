<template>
	<div v-if="isAdmin">
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
import { errorMixin } from '@/mixins/errorMixin';
import { cloudFunctions } from '../../firebase.js';
import { httpsCallable } from 'firebase/functions';
import { mapGetters, mapActions } from 'vuex';
import UserForm from '../../components/users/UserForm.vue';


export default {
	name: 'UserCreate',
	mixins: [errorMixin],
	components: {
		UserForm,
	},
	data() {
		return {
			isLoading: false,
			error: null,
		};
	},
	computed: {
		...mapGetters({
			isAdmin: 'isAdmin'
		})
	},
	methods: {
		...mapActions('users', ['userByEmail']),
		async createUserLocal(userData) {
			this.isLoading = true;
			try {
				const userExists = await this.userByEmail(userData.email);
				if (userExists) {
					this.$loadErrorMessage(this.$options.name, `User with email ${userExists.email} already exists!`);
					this.isLoading = false;
					return;
				}
				const createUser = httpsCallable(cloudFunctions, 'createUser');
				const result = await createUser({ user: userData });
			} catch (error) {
				this.$loadErrorMessage(this.$options.name, error);
				this.isLoading = false;
				return;
			}

			this.isLoading = false;
			this.$router.replace('/users');
		}
	},
};
</script>