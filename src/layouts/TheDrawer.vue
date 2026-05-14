<template>
	<q-drawer
		:model-value="modelValue"
		side="right"
		behavior="mobile"
		elevated
		@update:model-value="emit('update:modelValue', $event)"
	>
		<q-list bordered>
			<q-item v-if="authStore.isAuthenticated" v-ripple clickable>
				<q-item-section avatar>
					<q-icon color="primary" name="bluetooth" />
				</q-item-section>
				<q-item-section>
					{{ authStore.email }}: {{ authStore.role }}
				</q-item-section>
			</q-item>
			<q-item
				v-if="authStore.isAuthenticated"
				v-ripple
				clickable
				@click="onLogout"
			>
				<q-item-section avatar>
					<q-icon color="primary" name="bluetooth" />
				</q-item-section>
				<q-item-section> Log out </q-item-section>
			</q-item>
		</q-list>
	</q-drawer>
</template>

<script setup>
const props = defineProps({
	modelValue: { type: Boolean, required: true },
	logoutLocal: { type: Function, required: true },
	authStore: { type: Object, required: true },
});
const emit = defineEmits(['update:modelValue']);

function onLogout() {
	emit('update:modelValue', false);
	props.logoutLocal();
}
</script>
