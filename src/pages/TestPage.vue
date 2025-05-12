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
export default {
    data() {
        return {
            tracking: false,
            paused: false,
            watchId: null,
            distance: 0,
            lastPosition: null
        };
    },
    methods: {
        startTracking() {
            if (!navigator.geolocation) {
                alert('Geolocation is not supported by your browser');
                return;
            }
            this.tracking = true;
            this.paused = false;
            // If resuming, don't reset lastPosition or distance
            if (!this.watchId) {
                this.watchId = navigator.geolocation.watchPosition(
                    this.updateDistance,
                    this.handleError,
                    {
                        enableHighAccuracy: true,
                        maximumAge: 1000,
                        timeout: 50000
                    }
                );
            }
        },
        pauseTracking() {
            this.tracking = false;
            this.paused = true;
            if (this.watchId !== null) {
                navigator.geolocation.clearWatch(this.watchId);
                this.watchId = null;
            }
        },
        stopAndReset() {
            this.tracking = false;
            this.paused = false;
            if (this.watchId !== null) {
                navigator.geolocation.clearWatch(this.watchId);
                this.watchId = null;
            }
            this.distance = 0;
            this.lastPosition = null;
        },
        updateDistance(position) {
            if (this.lastPosition) {
                const distanceBetween = this.calculateDistance(
                    this.lastPosition.coords,
                    position.coords
                );
                this.distance += distanceBetween;
                console.log('Distance updated:', this.distance, 'meters at', new Date().toLocaleTimeString());
            }
            this.lastPosition = position;
        },
        calculateDistance(coords1, coords2) {
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
        },
        handleError(error) {
            console.error('Geolocation error:', error);
            alert('Error getting location: ' + error.message); //Timeout expired
            this.stopAndReset();
        }
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