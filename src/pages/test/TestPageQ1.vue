<template>
    <q-page	v-touch-pan.up.right.prevent.mouse="handlePan" class="flex flex-center">
		<div class="row items-center">
			<div class="col text-center">
				Test Page
			</div>
			<div class="col text-center">
				<q-btn round icon="sync" color="red" @click="saveData" :loading="loading" />
			</div>
			<div class="col text-center">
				 <q-input filled v-model="data.name" input-class="text-center text-h5" color="teal" placeholder="Counter" />
			</div>
		</div>
		<div class="row full-width items-center">
			<div class="col text-center">
				<q-btn round icon="remove" color="black" @click="handleRemove"/>
			</div>
			<div class="col text-center text-h3">
				{{ data.counter }}
			</div>
			<div class="col text-center">
				<q-btn icon="add" v-touch-repeat:300:300:200:50.mouse.enter.space="handleAdd" color="red" @click="handleAdd" />
			</div>
		</div>
		<div class="row full-width items-center">
			<div class="col text-center">
				<q-btn round icon="refresh" color="black" @click="handleRefresh"/>
			</div>
		</div>
	</q-page>
</template>

<script>
import { reactive, ref } from 'vue';

export default {
    name: 'TestPage',
    setup() {

		const loading = ref(false);
		// const counter = ref(0);
		// const name = ref('Test text');
		const data = reactive({
			counter: 0,
			name: 'Test text',
		});
		const saveData = async () => {
			loading.value = true
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 2000))
			loading.value = false
			console.log('Data saved!')
		}


		// const handleAdd= () => { counter.value++; };
		// const handleRemove= () => { counter.value--; };
		// const handleRefresh= () => { counter.value = 0; };
		const handleAdd= () => { data.counter++; };
		const handleRemove= () => { data.counter--; };
		const handleRefresh= () => { data.counter = 0; };
		const handlePan = (event) => {
			if (event.delta.y < 0 ) {
				handleAdd();
			}
			if (event.delta.y > 0 ) {
				handleRemove();
			}
		};

        return {
			// counter,
			// name,
			data,
			handleAdd,
			handleRemove,
			handleRefresh,
			handlePan,
			loading,
			saveData,
        };
    }
};
</script>

<style scoped>
.q-page {
	max-width: 700px;
	margin: 0 auto;
}
</style>
