<template>
    <main v-if="isAdmin">
        <base-dialog @close="clearError" :show="!!error" title="An error is ocurred!">
            <p>{{ error }}</p>
        </base-dialog>
        <section>
            <base-card>
                <div v-if="isAuthenticated" class="controls">
                    <base-button link to="/user/add">Add New user</base-button>
                </div>
                <div v-if="isLoading">
                    <base-spinner></base-spinner>
                </div>
                <ul v-else-if="usersStore.hasUsers">
                    <user-actions v-for="user in usersStore.users" :key="user.userId" :user="user"></user-actions>
                </ul>
                <h3 v-else>No users found</h3>
            </base-card>
        </section>
    </main>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useUsersStore } from '@/stores/users';
import { useError } from '@/composables/useError';
import UserActions from '../../components/users/UserActions.vue';

export default {
    name: 'UserList',
    components: {
        UserActions
    },
    setup() {
        const componentName = 'UserList';
        const store = useStore();
		const usersStore = useUsersStore();
        const { error, setError, clearError } = useError(componentName);

        const isLoading = ref(false);

        // Vuex getters
        const isAuthenticated = computed(() => store.getters.isAuthenticated);
        const isAdmin = computed(() => store.getters.isAdmin);

		onMounted(async () => {
			if (!usersStore.users || !usersStore.hasUsers) {
				await loadUsersLocal();
			}
		});

		async function loadUsersLocal() {
			isLoading.value = true;
			try {
				await usersStore.loadUsers();
			} catch (err) {
				setError(err.message || 'Failed to load users');
			}
			isLoading.value = false;
		}

        return {
            componentName,
            error,
            clearError,
            isLoading,
            isAuthenticated,
            isAdmin,
			usersStore
        };
    }
};
</script>

<style scoped>
    ul {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .controls {
        display: flex;
        justify-content: space-between;
    }
</style>