<template>
  <base-dialog @close="handleError" :show="!!error" title="An error is ocurred!">
			<p>{{ error }}</p>
	</base-dialog>
	<div class="roadbook-item" :class="{ passed: line.passed }" @click="passedLineLocal()">
      <div class="order">{{ line.order }}</div>
      <div class="name">{{ line.name }}</div>
      <div class="tulip"><img class="tulip-img" v-if="line.tulip" :src="tulipSrc(line.tulip)"/></div>
      <div class="roadNo">{{ line.roadNo }}</div>
      <div class="note">{{ line.note }}</div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
	name: 'LineView',
	props: {
		line: {
			type: Object,
			required: true,
			default: () => ({}),
		},
    tripId: {
      type: String,
      required: true,
    },
	},
  data() {
		return {
			isLoading: false,
			error: null,
		};
	},
  methods: {
    ...mapActions('trips', ['passedLine']),
    async passedLineLocal() {
      this.isLoading = true;
      const passed = !this.line.passed;
      try {
				await this.passedLine({ tripId: this.tripId, lineId: this.line.id, passed: passed});
			} catch (error) {
				this.error = `Component ${this.$options.name}, Padlo fetch : ${error.message}` || 'Something went wrong!';
				return;
			}
			this.isLoading = false;
    },
    tulipSrc(tulip) {
			return `/src/static/img/${tulip}.svg`;
		},
    handleError() {
			this.error = null;
		},
  },
};
</script>

<style scoped>
.roadbook-item {
  display: grid;
  grid-template-columns: 0.5fr 1fr 0.5fr 1fr 2fr; /* Adjusted column widths */
  width: 100%;
  min-height: 100px; /* Adjust based on content */
  padding: 10px;
  box-sizing: border-box; /* Include padding in height calculation */
  border-top: 1px solid #ccc;
}

.roadbook-item.passed {
  background-color: #f0f0f0;
}

.order, .name, .tulip, .roadNo, .note {
  text-align: center;
  border-left: 1px solid #ccc;
  padding: 10px;
}

.order {
  border-left: none;
}

/* Centering order, tulip, and roadNo */
.roadbook-item > :nth-child(1),
.roadbook-item > :nth-child(3),
.roadbook-item > :nth-child(4) {
  display: flex;
  justify-content: center;
  align-items: center;
}

.tulip {
  width: 100%; /* Ensures the div takes the full width of its parent */
  height: auto; /* Adjusts the height automatically */
  display: flex; /* Uses Flexbox for centering */
  justify-content: center; /* Centers the image horizontally */
  align-items: center; /* Centers the image vertically */
}

.tulip-img {
  max-width: 100%; /* Image can grow up to the div's width, but no more */
  max-height: 100%; /* Image can grow up to the div's height, but no more */
  height: 80px; /* Maintains the aspect ratio */
  width: auto; /* Adjusts the width automatically */
}
</style>