<template>
	<q-item class="q-py-sm">
		<q-item-section>
			<div class="text-subtitle1">Name: {{ user.name }}</div>
			<div class="text-subtitle1">Role: {{ user.role }}</div>
			<div class="text-caption text-grey-7">Email: {{ user.email }}</div>
			<div class="text-body2">Description: {{ user.description }}</div>
		</q-item-section>
		<q-item-section side>
			<q-btn-group spread>
				<q-btn dense flat icon="edit" color="primary" :to="userEditLink" />
				<q-btn dense flat icon="delete" color="negative" @click="deleteUserLocal" />
			</q-btn-group>
		</q-item-section>
	</q-item>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { useUsersStore } from "@/stores/users";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

const props = defineProps({
	user: {
		type: Object,
		required: true,
	},
});

const authStore = useAuthStore();
const usersStore = useUsersStore();
const router = useRouter();
const $q = useQuasar();

const user = props.user;
const userEditLink = `/user/edit/${user.userId}`;

const deleteUserLocal = async () => {
	if (authStore.userId === user.userId) {
		$q.dialog({
			title: "Error",
			message: "You cannot delete yourself!",
		});
		return;
	}

	$q.dialog({
		title: "Confirm",
		message: `Are you sure you want to delete user: ${user.name}?`,
		cancel: true,
		persistent: true,
	})
		.onOk(async () => {
			$q.loading.show();
			try {
				await usersStore.deleteUser(user.userId);
				$q.loading.hide();
				$q.dialog({
					title: "Success",
					message: "User deleted successfully.",
				}).onOk(() => {
					router.replace("/users");
				});
			} catch (err) {
				$q.loading.hide();
				$q.dialog({ title: "Error", message: err.message || err });
			}
		})
		.onCancel(() => {
			return;
		});
};
</script>
