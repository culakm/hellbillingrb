<template>
  <base-dialog @close="handleError" :show="!!error" title="An error is ocurred!">
    <p>{{ error }}</p>
  </base-dialog>
  <div class="roadbook-item" :class="{ passed: line.passed }" @click="passedLineLocal()">
    <div class="roadbook-item-place">
      <div class="order">{{ line.order }}</div>
      <div class="point">
        <div class="point-grid">
          <div class="name" v-html="line.name"></div>
          <div class="tags">
            <div v-if="line.stop" class="stop">
              <div class="svgicon" :class="{ 'color-stop': !isTripViewPrint }">
                <img src="/img/interest_stop_transparent.svg" alt="stop">
              </div>
            </div>
            <div class="interest">
              <div v-if="line.culture" class="svgicon" :class="{ 'color-culture': !isTripViewPrint }"><img
                  src="/img/interest_c_transparent.svg" alt="culture"></div>
              <div v-if="line.history" class="svgicon" :class="{ 'color-history': !isTripViewPrint }"><img
                  src="/img/interest_h_transparent.svg" alt="history"></div>
              <div v-if="line.sport" class="svgicon" :class="{ 'color-sport': !isTripViewPrint }"><img
                  src="/img/interest_s_transparent.svg" alt="sport">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="map-page">
        <div class="map-page-label">Map Page</div>
        <div class="map-page-value">{{ line.mapPage }}</div>
      </div>
      <div class="distance">
        <div class="km-total">
          {{ typeof line.kmTotal === 'number' && line.kmTotal >= 0 ? line.kmTotal + ' Km' : '--' }}
        </div>
        <div class="km-start-end">
          {{ line.order === 1 ? 'DSS' : (line.order === this.trip.linesCount ? 'ASS' : '') }}
        </div>
        <div class="km-part">{{ line.kmPart > 0 ? line.kmPart + ' Km' : '--' }}</div>
      </div>
    </div>
    <div class="roadbook-item-road">
      <div class="tulip" :class="{ 'show-before': line.close, 'color-tulip': !isTripViewPrint }"><img class="tulip-img"
          v-if="line.tulip" :src="tulipSrc(line.tulip)" alt="tulip"></div>
      <div class="road-no">
        <div class="road-no-label">Road No.</div>
        <div class="road-no-value">{{ line.roadNo }}</div>
      </div>
      <div class="note" v-html="line.note"></div>
    </div>
  </div>
</template>

<script>
import { errorMixin } from '@/mixins/errorMixin';
import { mapGetters, mapActions } from 'vuex';

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
    ...mapGetters('trips', ['trip']),
    isTripViewPrint() {
      return this.$route.path.includes("trip/view/print");
    },
    isTripView() {
      return this.$route.path.includes("trip/view");
    },
    passFunctionality() {
      return this.isTripViewPrint() || this.$route.path.includes("trip/edit");
    }
  },
  mounted() {
    if (this.line.mapPage && (this.isTripView)) {
      this.line.mapPage = this.line.mapPage.replace(/,/g, ' ');
    }
  },
  methods: {
    ...mapActions('trips', ['passedLine']),
    async passedLineLocal() {
      if (this.passFunctionality) { return; }
      this.isLoading = true;
      const passed = !this.line.passed;
      try {
        await this.passedLine({ lineId: this.line.lineId, passed: passed });
      } catch (error) {
        this.$loadErrorMessage(this.$options.name, error);
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
    display: grid;
    grid-template-areas:
      "place"
      "road";
    border: 2px solid #111;
    padding: 0;
    margin: 0;
    width: 100%;
    page-break-inside: avoid;
  }

  .roadbook-item-place {
    height: 4rem;
    grid-area: place;
    border: #000 1px solid;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: stretch;
  }

  .roadbook-item-place>div {
    border: #000 1px solid;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }

  .roadbook-item-place>div.order {
    /* flex-grow: 0; flex-shrink: 0; flex-basis: 5%; */
    flex: 0 0 5%;
  }

  .roadbook-item-place>div.point {
    flex: 0 0 55%;
  }

  .roadbook-item-place>div.point .point-grid {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-areas:
      "name"
      "tags";
  }

  .roadbook-item-place>div.point .point-grid .name {
    margin: 0 1rem;
    grid-area: name;
    justify-self: left;
    align-self: center;
  }

  .roadbook-item-place>div.point .point-grid .tags {
    margin: 0 1rem;
    grid-area: tags;
    justify-self: left;
    align-self: center;
    display: flex;
  }

  .roadbook-item-place>div.point .point-grid .tags .stop {
    margin-right: 1rem;
  }

  .roadbook-item-place>div.point .point-grid .tags .interest {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .roadbook-item-place>div.distance {
    flex: 0 0 25%;
    position: relative;
  }


  .km-total {
    font-size: 1.3rem;
  }

  .km-part {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 50%;
    height: 33%;
    border-left: 1px solid #000;
    border-top: 1px solid #000;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .km-start-end {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 50%;
    height: 33%;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .svgicon {
    width: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
  }

  .svgicon img {
    max-height: 1.5rem;
  }

  .color-culture {
    background-color: yellow;
  }

  .color-history {
    background-color: brown;
  }

  .color-sport {
    background-color: blue;
  }

  .color-stop {
    background-color: red;
  }

  .roadbook-item-road {
    height: 4rem;
    grid-area: road;
    border: #000 1px solid;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: stretch;
  }

  .roadbook-item-road>div {
    border: #000 1px solid;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }

  .roadbook-item-road>div.tulip {
    flex: 0 0 15%;
    position: relative;
  }


  .tulip.show-before::before {
    content: "!";
    position: absolute;
    left: 1.5rem;
    top: 50%;
    transform: translate(-100%, -50%);
    font-size: 1.5rem;
    font-weight: bold;
  }

  .tulip.show-before.color-tulip::before {
    color: red;
  }

  .tulip-img {
    max-width: 70px;
    max-height: 50px;
    display: block;
  }

  .roadbook-item-road>div.road-no {
    flex: 0 0 15%;
    position: relative;
    display: flex;
    flex-direction: column
  }

  .roadbook-item-road>div.road-no .road-no-label {
    flex: 0 0 25%;
    align-self: flex-start;
    font-weight: normal;
  }

  .roadbook-item-road>div.road-no .road-no-value {
    flex: 1;
    align-self: flex-start;
    margin: 0.1rem 0.3rem;
    max-width: 11rem;
    word-wrap: break-word;
    overflow-wrap: break-word;
    white-space: break-spaces;
    word-break: break-word;
  }

  .roadbook-item-road>div.note {
    flex: 0 0 70%;
    padding: 0.2rem 0.3rem;
    font-weight: normal;
    justify-content: left;
    align-items: flex-start;
  }

  .roadbook-item-place>div.map-page {
    flex: 0 0 15%;
    position: relative;
    display: flex;
    flex-direction: column;
    /* Set flex container with column layout */
  }

  .roadbook-item-place>div.map-page .map-page-label {
    flex: 0 0 25%;
    align-self: flex-start;
    font-weight: normal;
  }

  .roadbook-item-place>div.map-page .map-page-value {
    flex: 1;
    align-self: flex-start;
    margin: 0.1rem 0.3rem;
    max-width: 9rem;
    word-wrap: break-word;
    overflow-wrap: break-word;
    white-space: break-spaces;
    word-break: break-word;
  }
</style>