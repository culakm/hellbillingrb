<template>
  <base-dialog @close="handleError" :show="!!error" title="An error is ocurred!">
    <p>{{ error }}</p>
  </base-dialog>
  <div class="roadbook-item">
    <div class="order">{{ line.order }}</div>
    <input class="name" type="text" id="name" v-model.trim="line.name" />
    <select id="tulip" v-model="line.tulip">
      <option value="">Select a Tulip</option>
      <option value="tulipR">Tulip Right</option>
      <option value="tulipL">Tulip Left</option>
      <option value="tulipF">Tulip Front</option>
    </select>
    <input type="text" id="roadNo" v-model.trim="line.roadNo" />
    <textarea id="note" rows="2" v-model.trim="line.note"></textarea>
  </div>
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
      isLoading: false,
      error: null,
      origLine: { ...this.line },
    };
  },
  methods: {
    editLineLocal() {
      const lineData = {
        lineId: this.line.id,
        order: this.line.order,
        name: this.line.name,
        tulip: this.line.tulip,
        roadNo: this.line.roadNo,
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
    handleError() {
      this.error = null;
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
        tulip: this.tulip.val,
        roadNo: this.roadNo.val,
        note: this.note.val,
        passed: false,
      };
      this.order.val = null;
      this.name.val = '';
      this.tulip.val = '';
      this.roadNo.val = '';
      this.note.val = '';

      this.$emit('save-line', formData);
    },
  },
};
</script>

<style scoped>
  .roadbook-item {
    display: grid;
    grid-template-columns: 0.1fr 1.3fr 1.1fr 0.5fr 2fr;
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
  .tulip,
  .roadNo,
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
  .roadbook-item> :nth-child(4) {
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