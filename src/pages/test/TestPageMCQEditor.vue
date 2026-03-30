<template>
	<mc-q-editor v-model="note" />
	<p>{{ note }}</p>
</template>

<script setup>
import McQEditor from "@/components/ui/mcQEditor.vue";
import { ref } from "vue";

const note = ref("");
</script>
