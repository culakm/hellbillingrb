<template>
    <div>
        <h1>Distance Tracker</h1>
        <p>Distance traveled: {{ distance.toFixed(2) }} meters</p>
        <button @click="startTracking" :disabled="tracking">Start</button>
        <button @click="pauseTracking" :disabled="!tracking">Pause</button>
        <button @click="stopAndReset" :disabled="!tracking && distance === 0">Stop & Reset</button>
    </div>
</template>

<script>
import { ref,onMounted } from 'vue';

export default {
    name: 'TestPageDistanceTracker',
    setup() {

        const componentName = 'TestPageDistanceTracker';
        onMounted(() => {
            console.log(`${componentName} mounted`);
        });
        const tracking = ref(false);
        const paused = ref(false);
        const watchId = ref(null);
        const distance = ref(0);
        const lastPosition = ref(null);

        function startTracking() {
            if (!navigator.geolocation) {
                alert('Geolocation is not supported by your browser');
                return;
            }
            tracking.value = true;
            paused.value = false;
            // If resuming, don't reset lastPosition or distance
            if (!watchId.value) {
                watchId.value = navigator.geolocation.watchPosition(
                    updateDistance,
                    handleError,
                    {
                        enableHighAccuracy: true,
                        maximumAge: 1000,
                        timeout: 50000
                    }
                );
            }
        }

        function pauseTracking() {
            tracking.value = false;
            paused.value = true;
            if (watchId.value !== null) {
                navigator.geolocation.clearWatch(watchId.value);
                watchId.value = null;
            }
        }

        function stopAndReset() {
            tracking.value = false;
            paused.value = false;
            if (watchId.value !== null) {
                navigator.geolocation.clearWatch(watchId.value);
                watchId.value = null;
            }
            distance.value = 0;
            lastPosition.value = null;
        }

        function updateDistance(position) {
            if (lastPosition.value) {
                const distanceBetween = calculateDistance(
                    lastPosition.value.coords,
                    position.coords
                );
                distance.value += distanceBetween;
                console.log('Distance updated:', distance.value, 'meters at', new Date().toLocaleTimeString());
            }
            lastPosition.value = position;
        }

        function calculateDistance(coords1, coords2) {
            const R = 6371000; // Earth radius in meters
            const toRad = x => (x * Math.PI) / 180;

            const lat1 = toRad(coords1.latitude);
            const lon1 = toRad(coords1.longitude);
            const lat2 = toRad(coords2.latitude);
            const lon2 = toRad(coords2.longitude);

            const dLat = lat2 - lat1;
            const dLon = lon2 - lon1;

            const a =
                Math.sin(dLat / 2) ** 2 +
                Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

            return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        }

        function handleError(error) {
            console.error('Geolocation error:', error);
            alert('Error getting location: ' + error.message); // Timeout expired
            stopAndReset();
        }

        return {
            componentName,
            tracking,
            paused,
            distance,
            startTracking,
            pauseTracking,
            stopAndReset
        };
    }
};
</script>

<style scoped>
    button {
        margin: 5px;
        padding: 10px 20px;
        font-size: 16px;
    }
</style>
