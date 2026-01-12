<template>
	<q-card class="q-pa-md shadow-2 rounded-borders" style="max-width: 520px; width: 100%; margin: auto">
		<q-card-section class="bg-primary text-white flex items-center q-mb-md rounded-borders">
			<q-icon name="person" size="32px" class="q-mr-sm" />
			<div class="text-h5">{{ formTitle }}</div>
		</q-card-section>
		<q-separator />
		<q-form @submit.prevent="submitForm" class="q-gutter-md">
			<q-input filled v-model="name" label="Name" :rules="[required]" autocomplete="off" />
			<q-input filled v-model="email" label="Email" type="email" :rules="emailRules" autocomplete="off" />
			<q-input filled v-model="password1" label="Password" type="password" :rules="!isEdit ? passwordRules : []" autocomplete="off" />
			<q-input filled v-model="password2" label="Confirm Password" type="password" :rules="!isEdit ? passwordMatchRules : passwordMatchRulesEdit" autocomplete="off" />
			<q-input filled v-model="description" label="Description" type="textarea" autogrow />
			<q-select filled v-model="role" label="Role" :options="roleOptions" option-value="value" option-label="label" map-options emit-value />
			<div class="row justify-end">
				<q-btn color="primary" label="Save User" type="submit" />
			</div>
		</q-form>
	</q-card>
</template>

<script setup>
import { ref, onMounted, computed, defineProps, defineEmits } from "vue";
import { required, emailRules, passwordRules, passwordMatch } from "@/composables/useFormValidationRules";

const props = defineProps({
	user: {
		type: Object,
		required: false,
		default: () => ({}),
	},
});
const emit = defineEmits(["save-data"]);

const roleOptions = [
	{ label: "User", value: "user" },
	{ label: "Editor", value: "editor" },
	{ label: "Admin", value: "admin" },
];

const name = ref("");
const email = ref("");
const password1 = ref("");
const password2 = ref("");
const description = ref("");
const role = ref("user");
const passwordMatchRulesEdit = [passwordMatch(password1)];
const passwordMatchRules = [required, passwordMatch(password1)];
let userId = "";
const isEdit = !!props.user.userId;
const formTitle = computed(() => (isEdit ? "Edit" : "Create") + " User");

onMounted(async () => {
	if (props.user.userId) {
		userId = props.user.userId;
		name.value = props.user.name || "";
		description.value = props.user.description || "";
		email.value = props.user.email || "";
		role.value = props.user.role || "user";
	}
});

const submitForm = () => {
	const userData = {
		userId: userId,
		name: name.value,
		email: email.value,
		password: password1.value,
		description: description.value,
		role: role.value,
	};
	emit("save-data", userData);
};
</script>
