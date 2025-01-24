<template>
    <base-dialog @close="handleError" :show="!!error" title="An error is ocurred!">
        <p>{{ error }}</p>
    </base-dialog>
    <section>
        <li>
            <div v-if="isLoading">
                <base-spinner></base-spinner>
            </div>
            <div class="header">
                <h3>{{ name }}</h3>
                <p>{{ description }}</p>
            </div>
            <div class="actions">
                <base-button link :to="userEditLink">Edit</base-button>
                <base-button @click="deleteUserLocal">Delete</base-button>
            </div>
        </li>
    </section>
</template>

<script>
import { cloudFunctions } from '../../firebase.js';
import { httpsCallable } from 'firebase/functions';
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'UserActions',
    props: ['userId', 'name', 'description'],
    data() {
        return {
            isLoading: false,
            error: null,
        };
    },
    computed: {
        ...mapGetters({ currentUserId: 'userId' }),
        userEditLink() {
            return `/user/edit/${this.userId}`;
        },
    },
    methods: {
        ...mapActions('users', ['deleteUser']),
        async deleteUserLocal() {
            if (this.currentUserId === this.userId) {
                alert('You cannot delete yourself!');
                return;
            }

            const confirmed = confirm('Are you sure you want to delete this user?');
            if (!confirmed) {
                this.isLoading = false;
                return;
            }

            this.isLoading = true;

            try {
                const deleteUser = httpsCallable(cloudFunctions, 'deleteUser');
                const result = await deleteUser({ userId: this.userId });
            } catch (error) {
                console.error('Error calling cloud function:', error);
                this.error = `User was not deleted! ${error}`;
                this.isLoading = false;
                return;
            }
            this.deleteUser({ userId: this.userId });
            this.isLoading = false;
            this.$router.replace('/users');
        },
        handleError() {
            this.error = null;
        },
    },
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
        margin-top: 10px;
        /* Adjust spacing between the header and actions */
    }
</style>