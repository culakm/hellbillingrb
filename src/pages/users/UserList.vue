<template>
	<q-page class="q-pa-md bg-grey-2">
		<q-card>
			<q-card-section class="row items-center justify-between">
				<div class="text-h6">Users</div>
				<q-btn color="primary" label="Add User" icon="add" to="/user/add" />
			</q-card-section>
			<q-separator />
			<q-list v-if="usersStore.hasUsers" bordered separator>
				<user-actions v-for="user in usersStore.users" :key="user.userId" :user="user"></user-actions>
			</q-list>
		</q-card>
	</q-page>
</template>

<script setup>
import { onMounted } from "vue";
import { useUsersStore } from "@/stores/users";
import { useQuasar } from "quasar";
import UserActions from "@/components/users/UserActions.vue";

const usersStore = useUsersStore();
const $q = useQuasar();

const loadUsersLocal = async () => {
	$q.loading.show();
	try {
		await usersStore.loadUsers();
	} catch (err) {
		$q.dialog({ title: "Error", message: err.message || err });
		$q.loading.hide();
	}
	$q.loading.hide();
};

onMounted(async () => {
	if (!usersStore.users || !usersStore.hasUsers) {
		await loadUsersLocal();
	}
});
</script>
