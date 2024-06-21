<template>
	<li class="line-container">
		<div class="line-item line-item-order">{{ line.order }}</div>
		<div class="line-item line-item-name">{{ line.name }}</div>
		<div class="line-item line-item-tulip">{{ line.tulip }}</div>
		<div class="line-item line-item-roadNo">{{ line.roadNo }}</div>
		<div class="line-item line-item-note">{{ line.note }}</div>
	</li>
</template>

<script>
export default {
	name: 'LineView',
	props: {
		line: {
			type: Object,
			required: true,
			default: () => ({}),
		},
	},
};
</script>

<style scoped>
.line-container {
	width: 100%;
	display: flex;
	justify-content: space-between;
	margin: 0;
	border: 1px solid #424242;
	padding: 0;
}

.line-item {
	margin: 0;
	padding: 0.5rem;
	border: 1px solid #424242;
	text-align: center;
	font-size: 20px;
	/* Set the font size to 20px */
	line-height: 1.2;
	/* This is typically a good line-height for readability */
	height: calc(1.5em * 3);
	/* Set the height to accommodate 3 lines of text */
	overflow: auto;
	/* Add a scrollbar if the content exceeds the height */
}

.line-item.line-item-order {
	flex: 0 0 5%;
}

.line-item.line-item-name {
	flex: 0 0 35%;
}

.line-item.line-item-tulip {
	flex: 0 0 25%;
}

.line-item.line-item-roadNo {
	flex: 0 0 10%;
}

.line-item.line-item-note {
	flex: 0 0 25%;
}
</style>