<template>
    <li>
        <div class="header">
            <h3>{{ name }}</h3>
            <p>{{ description }}</p>
        </div>
        <div class="actions">
            <base-button link :to="userEditLink">Edit</base-button>
            <base-button @click="deleteTrip">Delete</base-button>
        </div>
    </li>
</template>

<script>
export default {
    name: 'UserActions',
    props: ['userId', 'name', 'description'],
    computed: {
        userEditLink() {
            return `/user/edit/${this.userId}`;
        },
    },
    methods: {
        deleteTrip() {
            this.$store.dispatch('users/deleteTrip', { userId: this.userId });
            this.$router.replace('/users');
        },
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
        margin-top: 10px;
        /* Adjust spacing between the header and actions */
    }
</style>