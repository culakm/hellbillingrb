<template>
    <div>
        <h1>Test page</h1>
        <p>testMessage: {{ testMessage }}</p>
        <p v-if="isAuthenticated">You are authenticated!</p>
        <button @click="testFunction">Change values</button>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { db } from '../../firebase.js';
import { collection, doc, getDoc, addDoc, setDoc, updateDoc, deleteDoc, getDocs, writeBatch, query, orderBy, where, limit, startAfter } from "firebase/firestore";


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

        const store = useStore();
        const isAuthenticated = computed(() => store.getters.isAuthenticated);
        function testFunction() {
            // This function is just for testing purposes
            testMessage.value = 'The value has been changed!';
            console.log('testFunction called, message changed');
        }

        return {
            testMessage,
            isAuthenticated,
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
