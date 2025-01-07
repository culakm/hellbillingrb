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
			console.error('Error fetching file URL:', error);
		}
	},
	// async deleteImage({ commit, rootState }, payload) {
	// 	const tripId = payload.tripId;
	// 	const imageName = payload.imageName;
	// 	const fileName = `trips/${tripId}/${imageName}`;
	// 	const fileRef = storageRef(storage, fileName);
	// 	try {
	// 		await deleteObject(fileRef);
	// 		console.log('File deleted successfully222');
	// 	} catch (error) {
	// 		console.error('Error deleting file:', error);
	// 	}
	// 	// context.commit('deleteImage', {});
	// 	commit('deleteImage', { payload, rootState });
	// }
	async deleteStorageObject(context, payload) {
		const tripId = payload.tripId;
		const imageName = payload.imageName;
		const fileName = `trips/${tripId}/${imageName}`;
		const fileRef = storageRef(storage, fileName);
		try {
			await deleteObject(fileRef);
		} catch (error) {
			console.error('Error deleting file:', error);
			throw new Error('Failed to delete trip image from firbase storage!');
		}
	}
};