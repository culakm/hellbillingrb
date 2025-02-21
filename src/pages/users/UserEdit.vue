<template>
	<div>
		<base-dialog @close="handleError" :show="!!error" title="An error is ocurred!">
			<p>{{ error }}</p>
		</base-dialog>
		<section>
			<base-card>
				<h2>Edit User.</h2>
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
import { errorMixin } from '@/mixins/errorMixin';
import { cloudFunctions } from '../../firebase.js';
import { httpsCallable } from 'firebase/functions';
import UserForm from '../../components/users/UserForm.vue';
import { mapActions } from 'vuex';

export default {
	name: 'UserEdit',
	mixins: [errorMixin],
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
	async created() {
		this.userId = this.$route.params.userId;
		this.user = await this.userByIdStore(this.userId);
	},
	methods: {
		...mapActions('users', ['userByIdStore']),

		async updateUserLocal(userData) {
			this.isLoading = true;
			try {
				const updateUser = httpsCallable(cloudFunctions, 'updateUser');
				const result = await updateUser({ user: userData });
				//this.$loadErrorMessage(this.$options.name, result.data.message);
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