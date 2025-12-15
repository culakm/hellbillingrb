<template>
	<main>
		<base-dialog @close="clearError" :show="!!error" title="An error is ocurred!">
			<p>{{ error }}</p>
		</base-dialog>
		<base-dialog :show="isLoading" fixed title="Authenticating...">
			<base-spinner></base-spinner>
		</base-dialog>
		<base-card>
			<form @submit.prevent="submitForm">
				<div class="form-control" :class="{ invalid: !email.isValid }">
					<label for="email">E-Mail</label>
					<input type="email" id="email" autocomplete="username" v-model.trim="email.val" @blur="clearValidity('email')" />
				</div>
				<div class="form-control" :class="{ invalid: !password.isValid }">
					<label for="password">Password</label>
					<input type="password" id="password" autocomplete="current-password" v-model.trim="password.val"
						@blur="clearValidity('password')" />
				</div>
				<p v-if="!formIsValid" class="invalid">Please fix errors, password min. 6 characters</p>
				<base-button submit>Login</base-button>
			</form>
		</base-card>
	</main>
</template>

<script>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { useError } from '@/composables/useError';

export default {
	name: 'UserAuth',
	setup() {
		const componentName = 'UserAuth';
		const authStore = useAuthStore();
		const router = useRouter();
		const { error, setError, clearError } = useError(componentName);

		const email = ref({ val: '', isValid: true });
		const password = ref({ val: '', isValid: true });
		const formIsValid = ref(true);
		const isLoading = ref(false);

		function clearValidity(input) {
			if (input === 'email') {
				email.value.isValid = true;
			}
			if (input === 'password') {
				password.value.isValid = true;
			}
		}

		function validateForm() {
			formIsValid.value = true;
			if (email.value.val === '' || !email.value.val.includes('@')) {
				email.value.isValid = false;
				formIsValid.value = false;
			}
			if (password.value.val === '' || password.value.val.length < 6) {
				password.value.isValid = false;
				formIsValid.value = false;
			}
		}

		async function submitForm() {
			validateForm();
			if (!formIsValid.value) {
				return;
			}

			isLoading.value = true;

			const userData = {
				email: email.value.val,
				password: password.value.val
			};

			try {
				await authStore.login(userData);
				router.replace('/');
			} catch (err) {
				setError(err.message || err);
				password.value.val = '';
			}
			isLoading.value = false;
		}

		return {
			componentName,
			error,
			clearError,
			email,
			password,
			formIsValid,
			isLoading,
			submitForm,
			clearValidity
		};
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