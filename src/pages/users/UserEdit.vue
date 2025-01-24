<template>
	<div>
		<base-dialog @close="handleError" :show="!!error" title="An error is ocurred!">
			<p>{{ error }}</p>
		</base-dialog>
		<section>
			<base-card>
				<div v-if="isLoading">
					<base-spinner></base-spinner>
				</div>
				<div v-else-if="user">
					<user-form @save-data="updateUserLocal" :user="user"></user-form>
				</div>
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
	name: 'UserEdit',
	components: {
		UserForm,
	},
	data() {
		return {
			isLoading: false,
			error: null,
			userId: null,
			user: null,
		};
	},
	created() {
		this.userId = this.$route.params.userId;
		this.userByIdLocal();
	},
	methods: {
		...mapActions({
			authUpdateUser: 'updateUser', //vyhodit
			usersUpdateUser: 'users/updateUser', //	vyhodit
			userById: 'users/userById',
			userByEmail: 'users/userByEmail',
		}),
		async userByIdLocal() {
			this.isLoading = true;
			try {
				const userData = await this.userById(this.userId);
				this.user = userData;
			} catch (error) {
				this.error = `Component ${this.$options.name}, error: ${error.message}` || 'Something went wrong!';
			}
			this.isLoading = false;
		},
		async updateUserLocal(userData) {
			this.isLoading = true;

			try {
				// const userExists = await this.userByEmail(userData.email);
				// if (userExists) {
				// 	this.error = `User with email ${userExists.email} already exists!`;
				// 	this.isLoading = false;
				// 	return;
				// }
				const updateUser = httpsCallable(cloudFunctions, 'updateUser');
				const result = await updateUser({ user: userData });
			} catch (error) {
				this.error = `User was not updated! ${error}`;
				this.isLoading = false;
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

<style scoped>
	.buttons {
		margin-top: 35px;
	}

	.ghost {
		opacity: 0.5;
		background: #c8ebfb;
	}

	.not-draggable {
		cursor: no-drop;
	}
</style>