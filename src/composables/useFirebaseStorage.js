import { ref } from 'vue';
import { storage } from '../firebase.js';
import { ref as storageRef, uploadBytesResumable,  getDownloadURL, deleteObject } from 'firebase/storage';


export function useFirebaseStorage() {
	const uploadProgress = ref(0)

	async function fetchImageUrl(imageName, tripId) {
		const fileName = `trips/${tripId}/${imageName}`;
		const fileRef = storageRef(storage, fileName);
		try {
			return await getDownloadURL(fileRef);
		} catch (error) {
			const errorOut = `Error fetching file URL: ${imageName}: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	}
	async function deleteStorageObject(tripId, imageName) {
		const fileName = `trips/${tripId}/${imageName}`;
		const fileRef = storageRef(storage, fileName);
		try {
			return await deleteObject(fileRef);
		} catch (error) {
			const errorOut = `Failed to delete file ${imageName}: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	}

	async function uploadStorageObject(file, path) {
		try {
			const fileRef = storageRef(storage, path);
			const uploadTask = uploadBytesResumable(fileRef, file);

			let lastProgressUpdate = 0;
			const PROGRESS_THROTTLE = 500;

			uploadTask.on('state_changed', (snapshot) => {
				const now = Date.now();
				if (now - lastProgressUpdate >= PROGRESS_THROTTLE) {
					const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
					uploadProgress.value = progress;
					lastProgressUpdate = now;
				}
			});

			await uploadTask;
			uploadProgress.value = 100;
			return await getDownloadURL(uploadTask.snapshot.ref);
		} catch (error) {
			const errorOut = `Failed to upload file: ${file.name}: ${error.message}`;
			console.error(errorOut);
			throw new Error(errorOut);
		}
	}


  return { fetchImageUrl, uploadStorageObject, deleteStorageObject, uploadProgress }
}