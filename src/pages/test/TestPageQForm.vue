<template>
	<q-page class="flex flex-center bg-grey-2">
		<Container>
			<q-card class="q-pa-xl shadow-2">
				<q-form @submit.prevent="submitForm" ref="formRef">
					<q-card-section class="text-center q-mb-md">
						<div class="text-h5 text-primary q-mb-sm">Formular</div>
					</q-card-section>
					<q-card-section>
						<q-input filled label="Form1 (optional)" v-model="form1" />
						<q-input filled label="Name (required)" v-model="name" :rules="[required]" lazy-rules />
						<q-input outlined type="email" label="Email" v-model="email" stack-label class="q-mb-md" :rules="emailRules" autocomplete="off" />
						<q-input outlined type="password" label="Password" v-model="password" stack-label class="q-mb-md" :rules="passwordRules" autocomplete="off" />
						<q-select filled v-model="role" label="Role" :options="roleOptions" outlined class="q-mb-md" option-value="value" option-label="label" map-options emit-value />
					</q-card-section>
					<q-card-actions>
						<q-btn color="primary" type="submit" class="full-width" label="Submit" />
					</q-card-actions>
				</q-form>
			</q-card>
		</Container>
	</q-page>
</template>

<script setup>
import { ref } from "vue";
import { emailRules, passwordRules, required } from "@/composables/useFormValidationRules";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

const router = useRouter();
const $q = useQuasar();
const formRef = ref(null);
const form1 = ref("");
const name = ref("");
const email = ref("");
const password = ref("");
const role = ref("editor");
const roleOptions = [
	{ label: "User", value: "user" },
	{ label: "Editor", value: "editor" },
	{ label: "Admin", value: "admin" },
];

role.value = "editor";

const submitForm = async () => {
	$q.loading.show();
	console.log("Submitting form...");
	console.log("form values:", {
		form1: form1.value,
		name: name.value,
		email: email.value,
		password: password.value,
		role: role.value,
	});
	const ok = await formRef.value.validate();
	if (!ok) {
		$q.loading.hide();
		$q.dialog({
			title: "Error",
			message: "Validation failed.",
		});
		return;
	}

	try {
		await new Promise((resolve) => setTimeout(resolve, 2000));
		$q.loading.hide();
		$q.dialog({
			title: "Success",
			message: "User updated successfully. Redirecting to home page.",
		}).onOk(() => {
			router.replace("/");
		});
	} catch (err) {
		$q.loading.hide();
		$q.dialog({
			title: "Error",
			message: err.message || err,
		});
	}
};
</script>
