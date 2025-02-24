<template>
  <div class="roadbook-item">
    <div class="order">{{ line.order }}</div>
    <input class="name" id="name" name="name" type="text" v-model.trim="line.name" />
    <input class="kmTotal" id="kmTotal" name="kmTotal" type="number" v-model.number="line.kmTotal" />
    <select class="tuplip" id="tulip" name="tulip" v-model="line.tulip">
      <option value="">Select a Tulip</option>
      <option value="tulipR">Tulip Right</option>
      <option value="tulipL">Tulip Left</option>
      <option value="tulipF">Tulip Front</option>
    </select>
    <input type="text" id="roadNo" name="roadNo" v-model.trim="line.roadNo" />
    <div>
      <input id="interest-history" name="interest" type="checkbox" value="history" v-model="line.interest" />
      <label for="interest-history">Pamiatky</label>
    </div>
    <div>
      <input id="interest-culture" name="interest" type="checkbox" value="culture" v-model="line.interest" />
      <label for="interest-tutorials">Kultúra</label>
    </div>
    <div>
      <input id="interest-sport" name="interest" type="checkbox" value="sport" v-model="line.interest" />
      <label for="interest-sport">Šport</label>
    </div>
  </div>
  <input id="stop" name="stop" type="checkbox" v-model="line.stop" />
  <textarea id="note" rows="2" v-model.trim="line.note"></textarea>
  <base-button @click="editLineLocal">Save</base-button>
  <base-button @click="cancelLineLocal">Cancel</base-button>
</template>

<script>
export default {
  name: 'LineEdit',
  emits: ['save-line', 'cancel-edit'],
  props: {
    line: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  data() {
    return {
      origLine: { ...this.line },
    };
  },
  methods: {
    editLineLocal() {
      const lineData = {
        lineId: this.line.lineId,
        order: this.line.order,
        name: this.line.name,
        kmTotal: this.line.kmTotal,
        tulip: this.line.tulip,
        roadNo: this.line.roadNo,
        interest: this.line.interest,
        stop: this.line.stop,
        note: this.line.note,
        passed: this.line.passed,
      };
      this.$emit('save-line', lineData);
    },
    cancelLineLocal() {
      this.$emit('cancel-edit', this.origLine);
    },
    tulipSrc(tulip) {
      return `/img/${tulip}.svg`;
    },
    submitForm() {
      this.validateForm();
      if (!this.formIsValid) {
        return;
      }
      const formData = {
        lineId: this.lineId,
        order: this.order.val,
        name: this.name.val,
        kmTotal: this.kmTotal.val,
        tulip: this.tulip.val,
        roadNo: this.roadNo.val,
        interest: this.interest.val,
        stop: this.stop.val,
        note: this.note.val,
        passed: false,
      };

      this.order.val = null;
      this.name.val = '';
      this.kmTotal.val = null,
        this.tulip.val = '';
      this.roadNo.val = '';
      this.interest.val = [];
      this.stop.val = false;
      this.note.val = '';

      this.$emit('save-line', formData);
    },
  },
};
</script>

<style scoped>
  .roadbook-item {
    display: grid;
    grid-template-columns: 0.1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    /* Adjusted column widths */
    width: 100%;
    min-height: 100px;
    /* Adjust based on content */
    padding: 10px;
    box-sizing: border-box;
    /* Include padding in height calculation */
    border-top: 1px solid #ccc;
  }

  .order,
  .name,
  .kmTotal,
  .tulip,
  .roadNo,
  .interest,
  .stop,
  .note {
    text-align: center;
    border-left: 1px solid #ccc;
    padding: 10px;
  }

  .order {
    border-left: none;
  }

  /* Centering order, tulip, and roadNo */
  .roadbook-item> :nth-child(1),
  .roadbook-item> :nth-child(3),
  .roadbook-item> :nth-child(4),
  .roadbook-item> :nth-child(5),
  .roadbook-item> :nth-child(6),
  .roadbook-item> :nth-child(7),
  .roadbook-item> :nth-child(8),
  .roadbook-item> :nth-child(9) {
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