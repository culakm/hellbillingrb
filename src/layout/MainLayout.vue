<template>
<div style="width:100px;height:40px;z-index:10000;position:fixed;top:30px;left:30px;display:flex;align-items:center;justify-content:center;background-color: darkolivegreen;">
	<input type="checkbox" v-model="quasarStore.quasarOn" @change="quasarStore.saveToLocalStorage()" />
	<label>Q:{{ quasarStore.quasarOn }}</label>
</div>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
		<router-link to="/" class="main-header__brand">
			<img src="/kompas_transparent.png" alt="Hellbilling Road Book" style="width: 30px; height: 30px; margin-left: 20px;" />
		</router-link>
		<q-toolbar-title>
        	1qmc Quasar app, v{{ $q.version }}
        </q-toolbar-title>
		<q-btn color="primary" label="Go to Trips 1QMC" @click="goToTrips1qmc" class="q-ml-md" />

      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, onMounted, watch } from 'vue'
import { useQuasarStore } from '@/stores/quasar';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'MainLayout',


  setup () {
	const router = useRouter();
	const quasarStore = useQuasarStore();

	function goToTrips1qmc() {
		router.push('/trips1qmc');
	}

    return {
		goToTrips1qmc,
		quasarStore,
    }
  }
})
</script>