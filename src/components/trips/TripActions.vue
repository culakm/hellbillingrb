<template>
    <li>
        <div class="header">
            <h3>{{ name }}</h3>
            <p>{{ description }}</p>
        </div>
        <div class="actions">
            <base-button link :to="tripViewLink">View</base-button>
            <base-button link :to="tripEditLink">Edit</base-button>
            <base-button link :to="tripPrintLink" :newTab="true">Print</base-button>
            <base-button @click="deleteTrip">Delete</base-button>
        </div>
    </li>
</template>

<script>
export default {
    name: 'TripActions',
    props: ['tripId', 'name', 'description'],
    computed: {
        tripViewLink() {
            return `/trip/view/${this.tripId}`;
        },
        tripPrintLink() {
            return `/trip/view/print/${this.tripId}`;
        },
        tripEditLink() {
            return `/trip/edit/${this.tripId}`;
        },
    },
    methods: {
        deleteTrip() {
            this.$store.dispatch('trips/deleteTrip', { tripId: this.tripId });
            this.$router.replace('/trips');
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