import { storage } from '../../../firebase.js';
import { ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

export default {
  namespaced: true,

  state() {
    return {
      uploadProgress: 0,
    };
  },

  mutations: {
    setUploadProgress(state, progress) {
      state.uploadProgress = progress;
    },

    // Unused currently
    deleteImage(state, { payload, rootState }) {
      console.log('deleteImage called');
      const trip = rootState.trips.trip;
      console.log('state trip', rootState);
      if (trip) {
        console.log('state trip', trip);
        trip.imageName = 'pako.jpg';
      } else {
        console.error('Trip not found in rootState.trips');
      }
    },
  },

  actions: {
    async fetchImageUrl(context, payload) {
      const tripId = payload.tripId;
      const imageName = payload.imageName;
      const fileName = `trips/${tripId}/${imageName}`;
      const fileRef = storageRef(storage, fileName);
      try {
        return await getDownloadURL(fileRef);
      } catch (error) {
        const errorOut = `Error fetching file URL: ${imageName}: ${error.message}`;
        console.error(errorOut);
        throw new Error(errorOut);
      }
    },

    async deleteStorageObject(context, { tripId, imageName }) {
      const fileName = `trips/${tripId}/${imageName}`;
      const fileRef = storageRef(storage, fileName);
      try {
        return await deleteObject(fileRef);
      } catch (error) {
        const errorOut = `Failed to delete file ${imageName}: ${error.message}`;
        console.error(errorOut);
        throw new Error(errorOut);
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
        const errorOut = `Failed to upload file: ${file.name}: ${error.message}`;
        console.error(errorOut);
        throw new Error(errorOut);
      }
    },
  },

  getters: {
    uploadProgress(state) {
      return state.uploadProgress;
    },
  },
};
