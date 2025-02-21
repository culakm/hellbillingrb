<template>
    <base-dialog @close="handleError" :show="!!error" title="An error is ocurred!">
        <p>{{ error }}</p>
    </base-dialog>
    <li>
        <div class="header">
            <h3>{{ name }}</h3>
            <p>{{ description }}</p>
        </div>
        <div v-if="isLoading">
            <base-spinner></base-spinner>
        </div>
        <div v-else class="actions">
            <base-button link :to="tripViewLink">View</base-button>
            <base-button link :to="tripEditLink">Edit</base-button>
            <base-button link :to="tripPrintLink" :newTab="true">Print</base-button>
            <base-button @click="deleteTripLocal">Delete</base-button>
        </div>
    </li>
</template>

<script>
import { errorMixin } from '@/mixins/errorMixin';
import { mapActions } from 'vuex';

export default {
    name: 'TripActions',
    mixins: [errorMixin],
    props: ['tripId', 'name', 'description'],
    data() {
        return {
            isLoading: false,
            error: null,
        };
    },
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
        ...mapActions('trips', ['deleteTrip']),
        async deleteTripLocal() {
            this.isLoading = true;
            try {
                await this.deleteTrip({ tripId: this.tripId });
            } catch (error) {
                this.$loadErrorMessage(this.$options.name, error);
            }
            this.isLoading = false;
            this.$router.replace('/trips');
        }
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