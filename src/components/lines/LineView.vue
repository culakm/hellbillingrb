<template>
  <base-dialog @close="handleError" :show="!!error" title="An error is ocurred!">
    <p>{{ error }}</p>
  </base-dialog>
  <div class="roadbook-item" :class="{ passed: line.passed }" @click="passedLineLocal()">
    <div class="order">{{ line.order }}</div>
    <div class="name" v-html="line.name"></div>
    <div class="km-total">{{ line.kmTotal }}</div>
    <div class="tulip"><img class="tulip-img" v-if="line.tulip" :src="tulipSrc(line.tulip)" /></div>
    <div class="road-no">{{ line.roadNo }}</div>
    <div class="road-type">{{ line.roadType }}</div>
    <div class="interest">{{ line.interest }}</div>
    <div class="note" v-html="line.note"></div>
  </div>
</template>

<script>
import { errorMixin } from '@/mixins/errorMixin';
import { mapActions } from 'vuex';

export default {
  name: 'LineView',
  mixins: [errorMixin],
  props: {
    line: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  data() {
    return {
      isLoading: false,
      error: null,
    };
  },
  computed: {
    isTripViewPrint() {
      if (this.$route.path.includes("trip/view/print") || this.$route.path.includes("trip/edit")) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    ...mapActions('trips', ['passedLine']),
    async passedLineLocal() {
      if (this.isTripViewPrint) { return; }
      this.isLoading = true;
      const passed = !this.line.passed;
      try {
        await this.passedLine({ lineId: this.line.lineId, passed: passed });
      } catch (error) {
        this.error = `Component ${this.$options.name}, Padlo fetch : ${error.message}` || 'Something went wrong!';
        return;
      }
      this.isLoading = false;
    },
    tulipSrc(tulip) {
      return `/img/${tulip}.svg`;
    }
  },
};
</script>

<style scoped>
  .roadbook-item {
    user-select: none;
    display: grid;
    grid-template-columns: 0.1fr 1.3fr 1.1fr 0.5fr 1fr 1fr;
    /* Adjusted column widths */
    width: 100%;
    min-height: 100px;
    /* Adjust based on content */
    padding: 10px;
    box-sizing: border-box;
    /* Include padding in height calculation */
    border-top: 1px solid #ccc;
  }

  .roadbook-item.passed {
    background-color: #f0f0f0;
  }

  .order,
  .name,
  .km-total,
  .tulip,
  .road-no,
  .road-type,
  .interest,
  .note {
    text-align: center;
    border-left: 1px solid #ccc;
    padding: 10px;
  }

  .order {
    border-left: none;
  }

  /* Centering order, kmTotal, tulip, and roadNo */
  .roadbook-item> :nth-child(1),
  .roadbook-item> :nth-child(3),
  .roadbook-item> :nth-child(4),
  .roadbook-item> :nth-child(5),
  .roadbook-item> :nth-child(6),
  .roadbook-item> :nth-child(7),
  .roadbook-item> :nth-child(8) {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .tulip {
    width: 100%;
    /* Ensures the div takes the full width of its parent */
    height: auto;
    /* Adjusts the height automatically */
    display: flex;
    /* Uses Flexbox for centering */
    justify-content: center;
    /* Centers the image horizontally */
    align-items: center;
    /* Centers the image vertically */
  }

  .tulip-img {
    max-width: 100%;
    /* Image can grow up to the div's width, but no more */
    max-height: 100%;
    /* Image can grow up to the div's height, but no more */
    height: 80px;
    /* Maintains the aspect ratio */
    width: auto;
    /* Adjusts the width automatically */
  }
</style>