import { loadErrorMessage, handleError, printNumber } from '../libs/utils.js';

export default {
	install(app) {
		// GlobalProperties for legacy support (optional)
		app.config.globalProperties.$loadErrorMessage = loadErrorMessage;
		app.config.globalProperties.$printNumber = printNumber;
		app.config.globalProperties.$handleError = handleError;

		// Provide for Composition API
		app.provide('utils', {
			loadErrorMessage,
			handleError,
			printNumber
		});
	}
};
