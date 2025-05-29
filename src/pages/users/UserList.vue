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
                <ul v-else-if="hasUsers">
                    <user-actions v-for="user in users" :key="user.userId" :user="user"></user-actions>
                </ul>
                <h3 v-else>No users found</h3>
            </base-card>
        </section>
    </main>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
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
        const { error, setError, clearError } = useError(componentName);
        const isLoading = ref(false);

        // Computed properties
        const isAuthenticated = computed(() => store.getters.isAuthenticated);
        const isAdmin = computed(() => store.getters.isAdmin);
        const users = computed(() => store.getters['users/users']);
        const hasUsers = computed(() => store.getters['users/hasUsers']);

        // Lifecycle hook
        onMounted(async () => {
            await loadUsersLocal();
        });

        // Methods
        async function loadUsersLocal() {
            isLoading.value = true;
            try {
                await store.dispatch('users/loadUsers');
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
            users,
            hasUsers
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