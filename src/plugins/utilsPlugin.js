import { loadErrorMessage, printNumber } from '../libs/utils.js';

export default {
	install(app) {
		app.config.globalProperties.$loadErrorMessage = loadErrorMessage;
		app.config.globalProperties.$printNumber = printNumber;
	}
};