<template>
    <base-dialog @close="clearError" :show="!!error" title="An error is ocurred!">
        <p>{{ error }}</p>
    </base-dialog>
    <section>
        <li>
            <div v-if="isLoading">
                <base-spinner></base-spinner>
            </div>
            <div class="header">
                <h3>{{ user.name }}</h3>
                <p>email: {{ user.email }}</p>
                <p>role: {{ user.role }}</p>
                <p>desc: {{ user.description }}</p>
            </div>
            <div class="actions">
                <base-button link :to="userEditLink">Edit</base-button>
                <base-button @click="deleteUserLocal">Delete</base-button>
            </div>
        </li>
    </section>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useError } from '@/composables/useError';
import { cloudFunctions } from '../../firebase.js';
import { httpsCallable } from 'firebase/functions';

export default {
    name: 'UserActions',
    props: {
        user: {
            type: Object,
            required: true
        }
    },
    setup(props) {
        const componentName = 'UserActions';

        // Vuex and router
        const store = useStore();
        const router = useRouter();

        // Utils and error composables
        const { setError, clearError, error } = useError(componentName);

        // Local state
        const isLoading = ref(false);

        // Computed: get current userId from store
        const currentUserId = computed(() => store.getters['userId']);

        // Computed: edit link
        const userEditLink = computed(() => `/user/edit/${props.user.userId}`);

        // Delete user method
        async function deleteUserLocal() {
            if (currentUserId.value === props.user.userId) {
                setError('You cannot delete yourself!');
                return;
            }

            const confirmed = confirm(`Are you sure you want to delete user: ${props.user.name}?`);
            if (!confirmed) {
                return;
            }

            isLoading.value = true;

            try {
                const deleteUserFn = httpsCallable(cloudFunctions, 'deleteUser');
                await deleteUserFn({ userId: props.user.userId });
            } catch (err) {
                setError('An error occurred while deleting the user.');
                isLoading.value = false;
                return;
            }

            await store.dispatch('users/deleteUser', { userId: props.user.userId });
            isLoading.value = false;
            router.replace('/users');
        }

        return {
            componentName,
            isLoading,
            error,
            clearError,
            userEditLink,
            deleteUserLocal
        };
    }
};
</script>

<style scoped>
    li {
        margin: 1rem 0;
        border: 1px solid #424242;
        border-radius: 12px;
        padding: 1rem;
    }

    .header {
        display: flex;
        align-items: center;
    }

    .header h3,
    .header p {
        margin-right: 10px;
        /* Adjust spacing between h3 and p */
    }

    .actions {
        display: flex;
        justify-content: flex-start;
        /* Adjust spacing between the header and actions */
    }
</style>