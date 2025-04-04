<template>
	<div>
		<base-dialog @close="handleError" :show="!!error" title="An error is ocurred!">
			<p>{{ error }}</p>
		</base-dialog>
		<base-dialog :show="isLoading" fixed title="Authenticating...">
			<base-spinner></base-spinner>
		</base-dialog>
		<base-card>
			<form @submit.prevent="submitForm">
				<div class="form-control" :class="{ invalid: !email.isValid }">
					<label for="email">E-Mail</label>
					<input type="email" id="email" v-model.trim="email.val" @blur="clearValidity('email')" />
				</div>
				<div class="form-control" :class="{ invalid: !password.isValid }">
					<label for="password">Password</label>
					<input type="password" id="password" v-model.trim="password.val"
						@blur="clearValidity('password')" />
				</div>
				<p v-if="!formIsValid" class="invalid">Please fix errors, password min. 6 characters</p>
				<base-button>Login</base-button>
			</form>
		</base-card>
	</div>
</template>

<script>
import { errorMixin } from '@/mixins/errorMixin';
import { mapActions } from 'vuex';

export default {
	name: 'UserAuth',
	mixins: [errorMixin],
	data() {
		return {
			email: {
				val: '',
				isValid: true
			},
			password: {
				val: '',
				isValid: true
			},
			formIsValid: true,
			mode: 'login',
			isLoading: false,
			error: null
		};
	},
	methods: {
		...mapActions(['login']),
		validateForm() {
			this.formIsValid = true;
			if (this.email.val === '' || !this.email.val.includes('@')) {
				this.email.isValid = false;
				this.formIsValid = false;
			}
			if (this.password.val === '' || this.password.val.length < 6) {
				this.password.isValid = false;
				this.formIsValid = false;
			}
		},
		async submitForm() {
			this.validateForm();
			if (!this.formIsValid) {
				return;
			}

			this.isLoading = true;

			const userData = {
				email: this.email.val,
				password: this.password.val
			};

			try {
				await this.login(userData);
				this.$router.replace('/');
			} catch (error) {
				this.$loadErrorMessage(this.$options.name, error);
				this.password.val = '';
			}
			this.isLoading = false;
		},
		clearValidity(input) {
			this[input].isValid = true;
		},
	}
};
</script>

<style scoped>
	form {
		margin: 1rem;
		padding: 1rem;
	}

	.form-control {
		margin: 0.5rem 0;
	}

	label {
		font-weight: bold;
		margin-bottom: 0.5rem;
		display: block;
	}

	input,
	textarea {
		display: block;
		width: 100%;
		font: inherit;
		border: 1px solid #ccc;
		padding: 0.15rem;
	}

	input:focus,
	textarea:focus {
		border-color: #3d008d;
		background-color: #faf6ff;
		outline: none;
	}

	.invalid label {
		color: red;
	}

	.invalid input,
	.invalid textarea {
		border: 1px solid red;
	}

	.invalid,
	p {
		color: red;
	}
</style>