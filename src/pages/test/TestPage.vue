<template>
    <div>
        <h1>Test page piniaaa</h1>
		<p> moje auth stores user: {{ authStore.user }}</p>




		<p>meno tripu</p>
		<input type="text" v-model="newTripName" />
		<button @click="createTripLocal(newTripName)">Pridat trip</button>
		<p>Zobrazit len tie, co maju Trip v mene</p>
        <input type="checkbox" v-model="filteredTripsFlag" @click="changefilteredTripsFlag()"/>
		<p>RESET</p>
		<button @click="tripsStore.$reset">Reset tripov</button>
		<template v-if="tripsStore.hasTrips">
			<div >
				<p>Vsetky tripy na zobrazenie lines</p>
				<ul>
					<li v-for="trip in tripsStore.trips" :key="trip.tripId" :trip-id="trip.tripId" :name="trip.name" :description="trip.description" @click="tripsStore.loadLines(trip.tripId)">{{ trip.name }} - {{ trip.linesCount }}
						<ul v-if="trip.lines && trip.lines.length > 0">
							<li v-for="line in trip.lines" :key="line.lineId" @click="tripsStore.deleteLine(trip.tripId,line.lineId)">{{ line.name }} - {{ line.description }}</li>
						</ul>
					</li>
				</ul>

			</div>
			<div >
				<p>Vsetky tripy na mazanie, kliknutim mazeme trip</p>
				<ul>
					<li v-for="trip in tripsStore.trips" :key="trip.tripId" :trip-id="trip.tripId" :name="trip.name" :description="trip.description" @click="tripsStore.deleteTrip(trip.tripId)">{{ trip.name }}</li>
				</ul>
			</div>
			<div v-if="filteredTripsFlag">
				<p>len tie co maju 'Trip' v mene, je ich: {{ tripsStore.filteredTrips.length }}</p>
				<ul>
					<trip-actions v-for="trip in tripsStore.filteredTrips" :key="trip.tripId" :trip-id="trip.tripId" :name="trip.name"
								:description="trip.description"></trip-actions>
				</ul>
			</div>
			<div v-else>
				<p>Vsetky tripy, je ich: {{ tripsStore.tripsCount }}</p>
				<ul>
					<trip-actions v-for="trip in tripsStore.trips" :key="trip.tripId" :trip-id="trip.tripId" :name="trip.name" :description="trip.description"></trip-actions>
				</ul>
			</div>
		</template>

    </div>
</template>

<script>
import { ref,onMounted,computed, watchEffect } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useTripsStore } from '@/stores/trips';
import TripActions from '../../components/trips/TripActions.vue';

export default {
    name: 'TestPage',
	components: {
		TripActions,
	},
    setup() {
        const componentName = 'TestPage';
		const authStore = useAuthStore();
        const tripsStore = useTripsStore();

		const filteredTripsFlag = ref(false);

		const newTripName = ref('');

		onMounted(async () => {
			console.log('TestPage mounted, loading trips...');
			console.log(' USER v store je: ', authStore.user);
			tripsStore.loadTrips();
		});

		async function createTripLocal() {
			try {
				await tripsStore.createTrip(newTripName.value);
				newTripName.value = '';
			} catch (error) {
				console.error('Failed to create trip locally:', error.message);
			}
		}

		function changefilteredTripsFlag() {
			filteredTripsFlag.value = !filteredTripsFlag.value;
		}

        return {
			newTripName,
			createTripLocal,
			authStore,
            tripsStore,
			filteredTripsFlag,
			changefilteredTripsFlag,
        };
    }
};
</script>

<style scoped>
    h1 {
        margin: 5rem 0 0 0;
        color: blue;
        text-align: center;
    }
</style>
