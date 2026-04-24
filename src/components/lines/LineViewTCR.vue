<template>
	<div
		class="roadbook-item"
		:class="{ passed: line.passed === true && passFunctionality === false }"
		@click="passedLineLocal()"
	>
		<div class="order">{{ line.order }}</div>

		<template v-if="hasCoords">
			<div class="lat-value">{{ decimalToDMS(line.lat) }}</div>
			<div class="lng-value">{{ decimalToDMS(line.lng, false) }}</div>
			<!-- eslint-disable-next-line vue/no-v-html -- sanitized via DOMPurify -->
			<div class="note" v-html="sanitizedNote"></div>
		</template>

		<template v-else>
			<!-- eslint-disable-next-line vue/no-v-html -- sanitized via DOMPurify -->
			<div class="note span-3" v-html="sanitizedNote"></div>
		</template>
	</div>
</template>

<script setup>
import { toRef, computed } from 'vue';
import { useLinesStore } from '@/stores/lines';
import { useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { decimalToDMS } from '@/utils';
import { sanitizeRichText } from '@/composables/useSanitize';

const props = defineProps({
	line: {
		type: Object,
		default: () => ({}),
	},
});

const linesStore = useLinesStore();
const route = useRoute();
const $q = useQuasar();

const passFunctionality = computed(
	() =>
		route.path.includes('trip/view/print') || route.path.includes('trip/edit')
);

const hasCoords = computed(() => props.line.lat && props.line.lng);

const sanitizedNote = computed(() => sanitizeRichText(props.line.note));

const passedLineLocal = async () => {
	if (passFunctionality.value) return;
	$q.loading.show();
	const passed = !props.line.passed;
	try {
		await linesStore.passedLine(props.line.lineId, passed);
		$q.loading.hide();
	} catch (err) {
		$q.dialog({ title: 'Error', message: err.message || err });
		$q.loading.hide();
	}
};

const line = toRef(props, 'line');
</script>

<style scoped>
.roadbook-item {
	display: grid;
	grid-template-columns: 3% 7% 7% 1fr 4%;
	border: 1px solid #111;
	padding: 0;
	width: 100%;
	page-break-inside: avoid;
}

.roadbook-item > div {
	border-right: 1px solid #111;
	padding: 0.2rem 0.3rem;
	align-items: center;
}

.roadbook-item > div:last-child {
	border-right: none;
}

.order {
	font-weight: bold;
	justify-content: center;
	text-align: center;
}

.lat-value,
.lng-value {
	justify-content: center;
	text-align: center;
}

.note {
	justify-content: flex-start;
	text-align: left;
}

.check {
	justify-content: center;
	text-align: center;
}

.span-2 {
	grid-column: span 2;
}

.span-3 {
	grid-column: span 3;
}

.span-4 {
	grid-column: span 4;
}

.passed {
	background-color: #d3d3d3;
}
</style>
