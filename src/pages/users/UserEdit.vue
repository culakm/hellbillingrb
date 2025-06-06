<template>
    <main>
        <base-dialog @close="clearError" :show="!!error" title="An error is ocurred!">
            <p>{{ error }}</p>
        </base-dialog>
        <section>
            <base-card>
                <h2>Edit User.</h2>
                <div v-if="isLoading">
                    <base-spinner></base-spinner>
                </div>
                <div v-else-if="user">
                    <user-form @save-data="updateUserLocal" :user="user"></user-form>
                </div>
            </base-card>
        </section>
    </main>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { useError } from '@/composables/useError';
import UserForm from '../../components/users/UserForm.vue';
import { cloudFunctions } from '../../firebase.js';
import { httpsCallable } from 'firebase/functions';

export default {
    name: 'UserEdit',
    components: {
        UserForm,
    },
    setup() {
        const componentName = 'UserEdit';
        const store = useStore();
        const route = useRoute();
        const router = useRouter();
        const { error, setError, clearError } = useError(componentName);

        const isLoading = ref(false);
        const userId = ref(null);
        const user = ref(null);

        // Fetch user data on mount
        onMounted(async () => {
            userId.value = route.params.userId;
            user.value = await store.dispatch('users/userByIdStore', userId.value);
        });

        // Update user method
        async function updateUserLocal(userData) {
            isLoading.value = true;
            try {
                const updateUser = httpsCallable(cloudFunctions, 'updateUser');
                await updateUser({ user: userData });
                // Optionally handle result.data.message here
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
            user,
            updateUserLocal
        };
    }
};
</script>

<style scoped>
    .buttons {
        margin-top: 35px;
    }

    .ghost {
        opacity: 0.5;
        background: #c8ebfb;
    }

    .not-draggable {
        cursor: no-drop;
    }
</style>
