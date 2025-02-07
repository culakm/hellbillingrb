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
	},
	async uploadStorageObject({ commit }, payload) {
		const { file, path } = payload;
		const fileRef = storageRef(storage, path);

		const uploadTask = uploadBytesResumable(fileRef, file);

		return new Promise((resolve, reject) => {
			uploadTask.on('state_changed',
				(snapshot) => {
					const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					commit('setUploadProgress', progress);
				},
				(error) => {
					console.error('Error uploading file:', error);
					reject(error);
				},
				async () => {
					try {
						const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
						resolve(downloadURL);
					} catch (error) {
						console.error('Error getting download URL:', error);
						reject(error);
					}
				}
			);
		});
	}

	// toto je zatial nedoriesene
	// async uploadStorageObject(context, payload) {
	// 	console.log('uploadStorageObject called', payload);
	// 	const tripId = payload.tripId;
	// 	const imageData = payload.imageData;
	// 	const fileName = `trips/${tripId}/${imageData.name}`;
	// 	const fileRef = storageRef(storage, fileName);
	// 	const uploadTask = uploadBytesResumable(fileRef, imageData);
	// 	var imageUrl = '';
	// 	uploadTask.on('state_changed',
	// 		null, // Placeholder for progress updates
	// 		(error) => {
	// 			console.error('Upload failed:', error)
	// 		},
	// 		async () => {
	// 			console.log('Upload successful');
	// 			// imageUrl = await getDownloadURL(fileRef);
	// 			return await getDownloadURL(fileRef);
	// 			console.log('File available at action :', imageUrl);
	// 		}
	// 	);
	// 	return imageUrl;
	// 	// return new Promise((resolve, reject) => {
	// 	// 	uploadTask.on(
	// 	// 		'state_changed',
	// 	// 		null, // Placeholder for progress updates
	// 	// 		(error) => {
	// 	// 			console.error('Upload failed:', error);
	// 	// 			reject(error);
	// 	// 		},
	// 	// 		async () => {
	// 	// 			try {
	// 	// 				console.log('Upload successful');
	// 	// 				const imageUrl = await getDownloadURL(fileRef);
	// 	// 				console.log('File available at:', imageUrl);
	// 	// 				resolve(imageUrl);
	// 	// 			} catch (error) {
	// 	// 				console.error('Error getting download URL:', error);
	// 	// 				reject(error);
	// 	// 			}
	// 	// 		}
	// 	// 	);
	// 	// });
	// 	console.log('uploadStorageObject finished', imageUrl);
	// 	return imageUrl;
	// },
	// toto je zatial nedoriesene 2
	// async uploadStorageObject2(context, payload) {
	// 	console.log('uploadStorageObject called', payload);
	// 	const tripId = payload.tripId;
	// 	const imageData = payload.imageData;
	// 	const fileName = `trips/${tripId}/${imageData.name}`;
	// 	const fileRef = storageRef(storage, fileName);
	// 	const uploadTask = uploadBytesResumable(fileRef, imageData);

	// 	return new Promise((resolve, reject) => {
	// 		uploadTask.on(
	// 			'state_changed',
	// 			null, // Placeholder for progress updates
	// 			(error) => {
	// 				console.error('Upload failed:', error);
	// 				reject(error);
	// 			},
	// 			async () => {
	// 				try {
	// 					console.log('Upload successful');
	// 					const imageUrl = await getDownloadURL(fileRef);
	// 					console.log('File available at:', imageUrl);
	// 					resolve(imageUrl);
	// 				} catch (error) {
	// 					console.error('Error getting download URL:', error);
	// 					reject(error);
	// 				}
	// 			}
	// 		);
	// 	});
	// }
};