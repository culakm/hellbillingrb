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
import { mapGetters, mapActions } from 'vuex';
import UserForm from '../../components/users/UserForm.vue';

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
		};
	},
	computed: {
		...mapGetters('users', ['user', 'hasLines'])
	},
	created() {
		this.userId = this.$route.params.userId;
		this.userByIdLocal();
	},
	methods: {
		...mapActions('users', ['userById', 'addLine', 'updateLines']),
		async userByIdLocal() {
			this.isLoading = true;
			try {
				await this.userById(this.userId);
			} catch (error) {
				this.error = `Component ${this.$options.name}, error: ${error.message}` || 'Something went wrong!';
			}
			this.isLoading = false;
		},
		async updateUserLocal(userData) {
			this.isLoading = true;
			try {
				await this.$store.dispatch('users/updateUser', userData);
			} catch (error) {
				this.error = `Component ${this.$options.name}, Padlo fetch : ${error.message}` || 'Something went wrong!';
				return;
			}

			this.isLoading = false;

		},
		async addLineLocal(lineData) {
			this.isLoading = true;
			const lastOrder = this.user.lines.length;
			lineData.order = lastOrder + 1;
			lineData.userId = this.user.userId;

			try {
				await this.addLine(lineData);
			} catch (error) {
				this.error = `Component ${this.$options.name}, Padlo fetch : ${error.message}` || 'Something went wrong!';
				return;
			}
			this.isLoading = false;
		},
		lineIsEdited() {
			this.draggableEnabled = !this.draggableEnabled;
		},
		handleError() {
			this.error = null;
		},
		onEnd(evt) {
			this.dragging = false;
			this.user.lines.forEach((line, index) => {
				line.order = index + 1;
			});
			this.updateLines({ lines: this.user.lines, userId: this.user.userId });
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