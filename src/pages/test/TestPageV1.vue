<template>
    <div>
        <h1>Test page pinia</h1>
		<p>pako1: {{ tripsStore.pako1 }}</p>
		<p>pako2: {{ tripsStore.pako2 }}</p>
		<p>pako3: menilo sa pako1: {{ tripsStore.pako3 }}</p>
		<button @click="zmenNaraz">zmen pako1 pako2 naraz</button>
		<button @click="updateTripsConditionally">Update Trips Conditionally</button>
		<p>meno tripu</p>
		<input type="text" v-model="newTripName" />
		<button @click="createTripLocal(newTripId, newTripName)">Pridat trip</button>
		<p>Zobrazit len tie, co maju Trip v mene</p>
        <input type="checkbox" v-model="filteredTripsFlag" @click="changefilteredTripsFlag()"/>
		<p>RESET</p>
		<button @click="tripsStore.$reset">Reset tripov</button>
		<template v-if="tripsStore.hasTrips">
			<div >
				<p>Vsetky tripy na mazanie</p>
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
import { useTripsStore } from '@/stores/trips';
import TripActions from '../../components/trips/TripActions.vue';

function handleStoreSubscription(mutation, state, tripsStore) {
    // Check if pako2 has changed and update pako3 accordingly
    if (mutation.payload?.pako2) {
        tripsStore.pako3 = 'hoho, zmenil som sa cez patch function pretoze sa menilo pako2';
    }

    console.log(
        `Mutation type: ${mutation.type}, storeId: ${mutation.storeId}, payload: ${JSON.stringify(mutation.payload)}`
    );
}

export default {
    name: 'TestPage',
	components: {
		TripActions,
	},
    setup() {
        const componentName = 'TestPage';
        const tripsStore = useTripsStore();
		const filteredTripsFlag = ref(false);

		const newTripId = ref(null);
		const newTripName = ref('');

		// onMounted(() => {
		// 	const fetchNewTripId = async () => {
		// 		newTripId.value = await tripsStore.getTripNewId();
		// 		console.log("newTripId.value", newTripId.value);
		// 		tripsStore.loadTripsOrdered();
		// 	};
		// 	fetchNewTripId();
		// });

		onMounted(async () => {
			newTripId.value = await tripsStore.getTripNewId();
			tripsStore.loadTripsOrdered();
		});

		function createTripLocal() {
			tripsStore.createTrip(newTripId.value, newTripName.value);
			newTripId.value += Math.floor(Math.random() * 100) + 1; // Increment by a random value to avoid duplicates
			newTripName.value = '';
		}

		function changefilteredTripsFlag() {
			filteredTripsFlag.value = !filteredTripsFlag.value;
		}

		function zmenNaraz() {
			tripsStore.$patch((state) => {
				state.pako1 = 'zmenene pako1';
				state.pako2 = 'zmenene pako2';
			});
		}

		function updateTripsConditionally2() {
			tripsStore.$patch((state) => {
				if (state.pako1 === 'zmenene pako1') {
					state.pako1 = 'updated pako1';
				} else {
					state.pako1 = 'default pako1';
				}

				state.pako2 = `Updated at ${new Date().toLocaleTimeString()}`;
			});
		}
		function updateTripsConditionally() {
			tripsStore.$patch({
				pako1: 'new value',
				pako2: 'another value',
			});
		}

		// tripsStore.$subscribe((mutation, state) => {
        //     // import { MutationType } from 'pinia'
        //     mutation.type // 'direct' | 'patch object' | 'patch function'
        //     // same as tripsStore.$id
        //     mutation.storeId // 'trips'
        //     // only available with mutation.type === 'patch object'
        //     mutation.payload // patch object passed

        //     // update pako3 its value
        //     if (mutation.payload?.pako2) {
        //         tripsStore.pako3 = 'hoho, zmenil som sa cez patch function pretoze sa menilo pako2';
        //     }

        //     console.log(`${componentName} - mutation type: ${mutation.type}, storeId: ${mutation.storeId}, payload: ${JSON.stringify(mutation.payload)}`);
        // })
		tripsStore.$subscribe((mutation, state) => handleStoreSubscription(mutation, state, tripsStore));
        return {
			newTripId,
			newTripName,
			createTripLocal,
            tripsStore,
			filteredTripsFlag,
			changefilteredTripsFlag,
			zmenNaraz,
			updateTripsConditionally
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
