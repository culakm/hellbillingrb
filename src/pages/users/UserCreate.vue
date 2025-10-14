<template>
    <main v-if="isAdmin">
        <base-dialog @close="clearError" :show="!!error" title="An error is ocurred!">
            <p>{{ error }}</p>
        </base-dialog>
        <section>
            <base-card>
                <h2>Create User.</h2>
                <div v-if="isLoading">
                    <base-spinner></base-spinner>
                </div>
                <user-form @save-data="createUserLocal"></user-form>
            </base-card>
        </section>
    </main>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useUsersStore } from '@/stores/users';
import { useRouter } from 'vue-router';
import { useError } from '@/composables/useError';
import UserForm from '../../components/users/UserForm.vue';

export default {
    name: 'UserCreate',
    components: {
        UserForm,
    },
    setup() {
        const componentName = 'UserCreate';
        const store = useStore();
		const usersStore = useUsersStore();
        const router = useRouter();
        const { error, setError, clearError } = useError(componentName);

        const isLoading = ref(false);
        const isAdmin = computed(() => store.getters.isAdmin);

        async function createUserLocal(userData) {
            isLoading.value = true;
            try {
				const userExists = await usersStore.userByEmail(userData.email);
                if (userExists) {
                    setError(`User with email ${userExists.email} already exists!`);
                    isLoading.value = false;
                    return;
                }
                await usersStore.createUser(userData);
            } catch (err) {
                setError(err.message || err);
                isLoading.value = false;
                return;
            }
            isLoading.value = false;
            router.replace('/users');
        }

        return {
            componentName,
            error,
            clearError,
            isLoading,
            isAdmin,
            createUserLocal
        };
    }
};
</script>