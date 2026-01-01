<template>
	<q-page class="flex flex-center bg-grey-2">
		<Container>
			<q-card class="q-pa-xl shadow-2">
				<form @submit.prevent="submitForm">
					<q-card-section class="text-center q-mb-md">
						<div class="text-h5 text-primary q-mb-sm">Login</div>
					</q-card-section>
					<q-card-section>
						<q-input outlined v-model="email.val" label="Email" stack-label type="email" autocomplete="username" @blur="clearValidity('email')" class="q-mb-md"/>
						<q-input outlined v-model="password.val" label="Password" stack-label type="password" autocomplete="current-password" @blur="clearValidity('email')" class="q-mb-md" />
					</q-card-section>
					<q-card-actions>
						<q-btn color="primary" type="submit" class="full-width" label="Login"/>
					</q-card-actions>
				</form>
			</q-card>
		</Container>
	</q-page>
</template>

<script>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useError } from '@/composables/useError';

export default {
	name: 'UserAuth',
	setup() {
		const componentName = 'UserAuth';
		const authStore = useAuthStore();
		const router = useRouter();
		const $q = useQuasar();
		const { error, setError, clearError } = useError(componentName);

		const email = ref({ val: '', isValid: true });
		const password = ref({ val: '', isValid: true });
		const formIsValid = ref(true);
		const isLoading = ref(false);

		// function clearValidity(input) {
		// 	if (input === 'email') {
		// 		email.value.isValid = true;
		// 	}
		// 	if (input === 'password') {
		// 		password.value.isValid = true;
		// 	}
		// }

		const clearValidity = (input) => {
			if (input === 'email') {
				email.value.isValid = true;
			}
			if (input === 'password') {
				password.value.isValid = true;
			}
		};


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
				$q.dialog({
					title: 'Error',
					message: 'Please fix errors, password min. 6 characters'
				});
				return;
			}

			$q.loading.show();

			const userData = {
				email: email.value.val,
				password: password.value.val
			};

			try {
				await authStore.login(userData);
				router.replace('/');
			} catch (err) {
				setError(err.message || err);
				$q.dialog({
					title: 'Error',
					message: err.message || err
				});
				password.value.val = '';
			}
			$q.loading.hide();
		}

		return {
			email,
			password,
			submitForm,
			clearValidity
		};
	}
};
</script>

<style scoped>
.q-page {
	min-height: 100vh;
}
.q-card {
	width: 350px;
	max-width: 90vw;
	margin: auto;
}
</style>