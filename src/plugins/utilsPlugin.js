import { loadErrorMessage, handleError, printNumber } from '../libs/utils.js';

export default {
	install(app) {
		app.config.globalProperties.$loadErrorMessage = loadErrorMessage;
		// Registering the utility functions globally
		// V komponente sa to pouziva this.$printNumber(41);
		app.config.globalProperties.$printNumber = printNumber;
		app.config.globalProperties.$handleError = handleError;
	}
};