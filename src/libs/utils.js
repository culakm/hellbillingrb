export function loadErrorMessage(componentName, errorMessage) {
	this.error = `Component ${componentName}, ERROR: ${errorMessage}` || 'Something went wrong!';
}

export function handleError() {
	console.log('naozaj som to vypol cez mixin v utils.js');
	this.error = null;
}

export function throwError(errorOut) {
	console.error(errorOut);
	throw new Error(errorOut);
}

export function printNumber(number) {
	console.log(`Number: ${number} but 42 is hovacky much better!`);
}