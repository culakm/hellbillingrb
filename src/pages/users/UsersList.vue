<template>
	<div v-if="isAdmin">
		<base-dialog :show="!!error" title="An error occured..." @close="handleError">
			<p>{{ error }}</p>
		</base-dialog>
		<base-dialog :show="!!confirm" title="Really???">
			<p>Are you shure you want to delete this user?</p>
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
import { mapGetters, mapActions } from 'vuex';
import UserActions from '../../components/users/UserActions.vue';
export default {
	name: 'UsersList',
	components: {
		UserActions,
	},
	data() {
		return {
			isLoading: false,
			error: null,
			confirm: false,
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
				this.error = `Component ${this.$options.name}, error: ${error.message}` || 'Something went wrong!';
			}
			this.isLoading = false;
		},
		handleError() {
			this.error = null;
		},
	},

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