import { RouterLink } from 'vue-router';
<template>
	<button v-if="!link" :class="mode">
		<slot></slot>
	</button>
	<RouterLink v-else-if="link && !newTab" :to="to" :class="mode">
		<slot></slot>
	</RouterLink>
	<a v-else :href="to" :class="mode" target="_blank" rel="noopener noreferrer">
		<slot></slot>
	</a>
</template>

<script>
export default {
	props: {
		mode: {
			type: String,
			required: false,
			default: null
		},
		link: {
			type: Boolean,
			required: false,
			default: false,
		},
		to: {
			type: String,
			required: false,
			default: '/'
		},
		newTab: {
			type: Boolean,
			required: false,
			default: false,
		}
	}
};
</script>

<style scoped>
	button {
		display: block;
		margin: 0px;
		/* vertical-align: middle; */
		width: auto;
		text-align: center;
		text-decoration: none;
		line-height: normal;
		cursor: pointer;
		font: inherit;
		font-size: 1rem;
		font-weight: bold;
		color: #344a60;
		background: #ffa700;
		padding: 0.5rem 1rem;
		border-radius: 8px;
		border: 1px solid #ffa700;
		margin: 0 0.5rem;
	}

	a {
		margin: 0 0.5rem;
		text-decoration: none;
		color: #ffa700;
		font-weight: bold;
		color: #344a60;
		background: #ffa700;
		padding: 0.5rem 1rem;
		border-radius: 8px;
		border: 1px solid #ffa700;
	}

	a:hover,
	a:active,
	button:hover,
	button:active {
		color: #ffa700;
		background: white;
		border: 1px solid #344a60;
	}

	.flat {
		background-color: transparent;
		color: #344a60;
		border: none;
	}

	.outline {
		background-color: transparent;
		border: 1px solid #000000;
		color: #344a60;
	}


	.flat:hover,
	.flat:active,
	.outline:hover,
	.outline:active {
		background-color: #ffa700;
		;
	}
</style>