<template>
	<q-page class="q-pa-md bg-grey-2">
		<Container>
			<user-form
				v-if="isCreateMode"
				@save-data="saveUserLocal"
			></user-form>
			<user-form
				v-else-if="user"
				:key="user.userId"
				:user="user"
				@save-data="saveUserLocal"
			></user-form>
		</Container>
	</q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUsersStore } from '@/stores/users';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import UserForm from '@/components/users/UserForm.vue';

const usersStore = useUsersStore();
const route = useRoute();
const router = useRouter();
const $q = useQuasar();

const user = ref(null);

const isCreateMode = computed(() => !route.params.userId);

onMounted(async () => {
	if (isCreateMode.value) {
		user.value = null;
		return;
	}
	user.value = await usersStore.userById(route.params.userId);
});

const saveUserLocal = async (userData) => {
	if (isCreateMode.value) {
		$q.loading.show();
		try {
			const userExists = await usersStore.userByEmail(userData.email);
			if (userExists) {
				$q.loading.hide();
				$q.dialog({
					title: 'Error',
					message: `User with email ${userExists.email} already exists!`,
				});
				return;
			}
			await usersStore.createUser(userData);
			$q.loading.hide();
			$q.dialog({
				title: 'Success',
				message: 'User created successfully.',
			}).onOk(() => {
				router.replace('/users');
			});
		} catch (err) {
			$q.loading.hide();
			$q.dialog({ title: 'Error', message: err.message || err });
		}
		return;
	}

	$q.loading.show();
	try {
		await usersStore.updateUser(userData);
		$q.loading.hide();
		$q.dialog({
			title: 'Success',
			message: 'User updated successfully.',
		}).onOk(() => {
			router.replace('/users');
		});
	} catch (err) {
		$q.loading.hide();
		$q.dialog({ title: 'Error', message: err.message || err });
	}
};
</script>
