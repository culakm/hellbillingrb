<template>
    <div>
        <h1>Test page</h1>
        <p>testMessage: {{ testMessage }}</p>
        <p v-if="authStore.isAuthenticated">You are authenticated!</p>
        <button @click="testFunction">Change values</button>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { db } from '../../firebase.js';
import { collection, getDocs } from "firebase/firestore";


export default {
    name: 'TestPage',
    setup() {
        const componentName = 'TestPage';
        onMounted(async () => {
            console.log("Attempting Firestore read to trigger App Check token generation...");
            try {
                const querySnapshot = await getDocs(collection(db, "trips")); // Or any other collection
                querySnapshot.forEach((doc) => {
                    console.log(doc.id, " => ", doc.data());
                });
                console.log("Firestore read successful!");
            } catch (error) {
                console.error("Error during Firestore read:", error);
            }
        });

        const testMessage = ref('This is a test message');

		const authStore = useAuthStore();
        function testFunction() {
            testMessage.value = 'The value has been changed!';
            console.log('testFunction called, message changed');
        }

        return {
            testMessage,
			authStore,
            testFunction
        };
    }
};
</script>

<style scoped>
    h1 {
        margin: 5rem 0;
        color: blue;
        text-align: center;
    }
</style>
