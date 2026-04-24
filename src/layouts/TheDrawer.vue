<template>
	<q-drawer
		:model-value="modelValue"
		side="right"
		behavior="mobile"
		elevated
		@update:model-value="$emit('update:modelValue', $event)"
	>
		<div v-if="authStore.token" style="padding: 16px">
			<div>User: {{ authStore.email }}</div>
			<div>Role: {{ authStore.role }}</div>
		</div>
	</q-drawer>
</template>

<script setup>
defineProps({
	modelValue: Boolean,
	authStore: { type: Object, default: null },
});
defineEmits(['update:modelValue']);
</script>
