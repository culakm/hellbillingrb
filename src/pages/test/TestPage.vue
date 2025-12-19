<template>
    <div>
        <h1>Quasar Test page</h1>
        <q-btn color="primary" label="Click Me" @click="handleClick" />
    <q-btn color="secondary" label="Rounded" rounded unelevated />
    <q-btn icon="favorite" color="red" flat dense />

	<q-btn
    :loading="loading"
    color="teal"
    icon="save"
    label="Save Data"
    @click="saveData"
  />
    </div>
</template>

<script>
import { ref } from 'vue';
import { QBtn } from 'quasar'

export default {
    name: 'TestPage',
    setup() {

		const loading = ref(false);
		const saveData = async () => {
  loading.value = true
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000))
  loading.value = false
  console.log('Data saved!')
}


const handleClick = () => {
  console.log('Button clicked!')
}
        return {
			handleClick,
			loading,
			saveData
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
