<template>
	<div v-if="isAdmin">
		<base-dialog @close="handleError" :show="!!error" title="An error is ocurred!">
			<p>{{ error }}</p>
		</base-dialog>
		<section>
			<base-card>
				<div v-if="isAuthenticated" class="controls">
					<base-button link to="/user/add">Add New user</base-button>
				</div>
				<div v-if="isLoading">
					<base-spinner></base-spinner>
				</div>
				<ul v-else-if="hasUsers">
					<user-actions v-for="user in users" :key="user.userId" :user="user"></user-actions>
				</ul>
				<h3 v-else>No users found</h3>
			</base-card>
		</section>
	</div>
</template>

<script>
import { errorMixin } from '@/mixins/errorMixin';
import { mapGetters, mapActions } from 'vuex';
import UserActions from '../../components/users/UserActions.vue';
export default {
	name: 'UserList',
	mixins: [errorMixin],
	components: {
		UserActions,
	},
	data() {
		return {
			isLoading: false,
			error: null,
		};
	},
	computed: {
		...mapGetters({
			isAuthenticated: 'isAuthenticated',
			isAdmin: 'isAdmin',
			users: 'users/users',
			hasUsers: 'users/hasUsers'
		})
	},
	created() {
		this.loadUsersLocal();
	},
	methods: {
		...mapActions('users', ['loadUsers']),
		async loadUsersLocal() {
			this.isLoading = true;
			try {
				await this.loadUsers();
			} catch (error) {
				this.$loadErrorMessage(this.$options.name, error);
			}
			this.isLoading = false;
		}
	}
};
</script>

<style scoped>
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.controls {
		display: flex;
		justify-content: space-between;
	}
</style>