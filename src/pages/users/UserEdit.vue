<template>
	<q-page class="q-pa-md bg-grey-2">
		<Container>
			<user-form v-if="user" @save-data="updateUserLocal" :user="user"></user-form>
		</Container>
	</q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useUsersStore } from "@/stores/users";
import { useRoute, useRouter } from "vue-router";
import { useQuasar } from "quasar";
import UserForm from "@/components/users/UserForm.vue";

const usersStore = useUsersStore();
const route = useRoute();
const router = useRouter();
const $q = useQuasar();

const user = ref(null);

onMounted(async () => {
	user.value = await usersStore.userById(route.params.userId);
});

const updateUserLocal = async (userData) => {
	$q.loading.show();
	try {
		await usersStore.updateUser(userData);
		$q.loading.hide();
		$q.dialog({
			title: "Success",
			message: "User updated successfully.",
		}).onOk(() => {
			router.replace("/users");
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
