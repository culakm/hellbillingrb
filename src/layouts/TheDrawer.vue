<template>
  <q-drawer
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    side="right"
    behavior="mobile"
    elevated
  >
    <div v-if="authStore.token" style="padding: 16px;">
      <div>User: {{ authStore.email }}</div>
      <div>Role: {{ authStore.role }}</div>
    </div>
  </q-drawer>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
const props = defineProps({
  modelValue: Boolean,
  authStore: Object
});
const emit = defineEmits(['update:modelValue']);
</script>
