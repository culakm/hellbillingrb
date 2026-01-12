<template>
	<q-page class="q-pa-md bg-grey-2">
		<Container>
			<user-form @save-data="createUserLocal"></user-form>
		</Container>
	</q-page>
</template>

<script setup>
import { useUsersStore } from "@/stores/users";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import UserForm from "@/components/users/UserForm.vue";

const usersStore = useUsersStore();
const router = useRouter();
const $q = useQuasar();

const createUserLocal = async (userData) => {
	$q.loading.show();
	try {
		const userExists = await usersStore.userByEmail(userData.email);
		if (userExists) {
			$q.loading.hide();
			$q.dialog({
				title: "Error",
				message: `User with email ${userExists.email} already exists!`,
			});
			return;
		}
		await usersStore.createUser(userData);
		$q.loading.hide();
		$q.dialog({
			title: "Success",
			message: "User created successfully.",
		}).onOk(() => {
			router.replace("/users");
		});
	} catch (err) {
		$q.loading.hide();
		$q.dialog({ title: "Error", message: err.message || err });
		return;
	}
};
</script>
