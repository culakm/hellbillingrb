import { inject } from 'vue';

export function useUtils() {
	const utils = inject('utils');
	if (!utils) {
		throw new Error('Utils plugin not provided!');
	}
	return utils;
}
