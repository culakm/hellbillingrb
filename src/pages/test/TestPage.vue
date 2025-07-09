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


export default {
    name: 'TestPage',
    setup() {

        const componentName = 'TestPage';
        onMounted(() => {
            console.log(`${componentName} mounted`);
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
