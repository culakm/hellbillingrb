<template>
	<q-page class="q-pa-md bg-grey-2">
		<Container>
			<q-card class="q-pa-xl shadow-2">
				<q-form @submit.prevent="submitForm" ref="formRef">
					<q-card-section class="text-center q-mb-md">
						<div class="text-h5 text-primary q-mb-sm">Login</div>
					</q-card-section>
					<q-card-section>
						<q-input outlined type="email" label="Email" v-model="email" stack-label class="q-mb-md" autocomplete="username" :rules="emailRules" lazy-rules />
						<q-input outlined type="password" label="Password" v-model="password" stack-label class="q-mb-md" autocomplete="current-password" :rules="passwordRules" lazy-rules />
					</q-card-section>
					<q-card-actions>
						<q-btn color="primary" type="submit" class="full-width" label="Login" />
					</q-card-actions>
				</q-form>
			</q-card>
		</Container>
	</q-page>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { emailRules, passwordRules } from "@/composables/useFormValidationRules";

const authStore = useAuthStore();
const router = useRouter();
const $q = useQuasar();
const formRef = ref(null);
const email = ref("");
const password = ref("");

const submitForm = async () => {
	const ok = await formRef.value.validate();
	if (!ok) {
		$q.dialog({
			title: "Error",
			message: "Form is not valid",
		});
		return;
	}

	const userData = {
		email: email.value,
		password: password.value,
	};

	$q.loading.show();
	try {
		await authStore.login(userData);
		router.replace("/");
	} catch (err) {
		$q.dialog({
			title: "Error",
			message: err.message || err,
		});
		password.value = "";
	}
	$q.loading.hide();
};
</script>
