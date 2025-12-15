export function loadErrorMessage(componentName, errorMessage) {
	const error = `Component ${componentName}, ERROR: ${errorMessage}` || 'Something went wrong!';
	console.error(error);
	return error;
}

export function handleError() {
	return null;
}

export function throwError(errorOut) {
	console.error(errorOut);
	throw new Error(errorOut);
}

export function printNumber(number) {
	console.log(`Number: ${number} but 42 is hovacky much better!`);
}
