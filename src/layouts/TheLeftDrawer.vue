<template>
	<q-drawer
		:model-value="modelValue"
		show-if-above
		side="left"
		:width="150"
		@update:model-value="emit('update:modelValue', $event)"
	>
		<q-list v-if="authStore.isAuthenticated">
			<q-item v-ripple clickable to="/trips">
				<q-item-section avatar>
					<img
						src="/kompas_transparent.png"
						alt="Kompas"
						style="width: 24px; height: 24px"
					/>
				</q-item-section>
				<q-item-section>Trips</q-item-section>
			</q-item>
		</q-list>
		<q-list v-if="authStore.isAdmin">
			<q-item v-ripple clickable to="/users">
				<q-item-section avatar>
					<q-icon color="black" name="person" />
				</q-item-section>
				<q-item-section>Users</q-item-section>
			</q-item>
		</q-list>
		<q-list v-if="authStore.isAdmin">
			<q-item v-ripple clickable to="/test">
				<q-item-section avatar>
					<q-icon color="black" name="quiz" />
				</q-item-section>
				<q-item-section>Test</q-item-section>
			</q-item>
		</q-list>
	</q-drawer>
</template>

<script setup>
const emit = defineEmits(['update:modelValue']);

defineProps({
	modelValue: { type: Boolean, required: true },
	authStore: { type: Object, required: true },
});
</script>
