<template>
	<div style="background-color: #e8f0fe; width: 50px; height: 50px;">PAko</div>
	<q-page class="flex flex-center bg-grey-2">
		<Container>
			<q-card class="q-pa-xl shadow-2">
				<form @submit.prevent="saveData">
					<q-card-section class="text-center q-mb-md">
						<div class="text-h5 text-primary q-mb-sm">Login</div>
					</q-card-section>
					<q-card-section>
						<q-input filled v-model="email" label="Label" class="q-mb-md" autocomplete="username"
						 ></q-input>
						<!-- <q-input filled v-model="email" label="Email" class="q-mb-md" bg-color="green" autocomplete="username"></q-input> -->
						<!-- <q-input filled v-model="password" label="Password" type="password" color="teal" class="q-mb-md" autocomplete="current-password" ></q-input> -->
					</q-card-section>
					<q-card-actions align="center">
						<q-btn color="primary" type="submit" class="full-width" label="Login"/>
					</q-card-actions>
				</form>
			</q-card>
		</Container>
	</q-page>
</template>

<script>
import { ref } from 'vue';
import { useQuasar } from 'quasar';

export default {
    name: 'TestPage',
    setup() {

		const $q = useQuasar();
		const email = ref('');
		const password = ref('');

		const saveData = async () => {
			$q.loading.show();
			await new Promise(resolve => setTimeout(resolve, 2000));
			$q.loading.hide();
			$q.dialog({
				title: 'Alert',
				message: 'Some message 2'
			});
		}

        return {
			email,
			password,
			saveData,
        };
    }
};
</script>

<style scoped>
.q-page {
	min-height: 100vh;
}
.q-card {
	width: 350px;
	max-width: 90vw;
	margin: auto;
}
input:-internal-autofill-selected {
	background-color: red !important;
}
</style>
