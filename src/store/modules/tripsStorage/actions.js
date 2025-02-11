import { storage } from '../../../firebase.js';
import { ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

export default {
	async fetchImageUrl(context, payload) {
		const tripId = payload.tripId;
		const imageName = payload.imageName;
		const fileName = `trips/${tripId}/${imageName}`;
		const fileRef = storageRef(storage, fileName);
		try {
			return await getDownloadURL(fileRef);
		} catch (error) {
			throw new Error(`Error fetching file URL: ${imageName}: ${error.message}`);
		}
	},
	async deleteStorageObject(context, { tripId, imageName }) {
		const fileName = `trips/${tripId}/${imageName}`;
		const fileRef = storageRef(storage, fileName);
		try {
			return await deleteObject(fileRef);
		} catch (error) {
			throw new Error(`Failed to delete image ${imageName}: ${error.message}`);
		}
	},

	async uploadStorageObject({ commit }, { file, path }) {
		try {
			const fileRef = storageRef(storage, path);
			const uploadTask = uploadBytesResumable(fileRef, file);

			let lastProgressUpdate = 0;
			const PROGRESS_THROTTLE = 500;

			uploadTask.on('state_changed', (snapshot) => {
				const now = Date.now();
				if (now - lastProgressUpdate >= PROGRESS_THROTTLE) {
					const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
					commit('setUploadProgress', progress);
					lastProgressUpdate = now;
				}
			});

			await uploadTask;
			commit('setUploadProgress', 100);
			return await getDownloadURL(uploadTask.snapshot.ref);
		} catch (error) {
			throw new Error(`Failed to upload file: ${error.message}`);
		}
	}

};