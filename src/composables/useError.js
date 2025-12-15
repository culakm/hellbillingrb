import { ref } from 'vue';
import { useUtils } from './useUtils';

export function useError(componentName = 'UnknownComponent') {
	const error = ref(null);
	const { loadErrorMessage, handleError } = useUtils();

	function setError(errorMessage) {
		error.value = loadErrorMessage(componentName, errorMessage);
	}

	function clearError() {
		error.value = handleError();
	}

	return {
		error,
		setError,
		clearError
	};
}
