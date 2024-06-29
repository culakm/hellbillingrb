<template>
  <base-dialog @close="handleError" :show="!!error" title="An error is ocurred!">
			<p>{{ error }}</p>
	</base-dialog>
	<div class="roadbook-item" :class="{ passed: line.passed }" @click="passedLineLocal()">
      <div class="order">{{ line.order }}</div>
      <div class="name">{{ line.name }}</div>
      <div class="tulip">{{ line.tulip }}</div>
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
</style>