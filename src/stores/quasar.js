import { defineStore } from 'pinia';

export const useQuasarStore = defineStore('quasar', {
  state: () => ({
    quasarOn: false,
  }),
  actions: {
    loadFromLocalStorage() {
      const savedFlag = localStorage.getItem('quasarOn');
      if (savedFlag !== null) {
        this.quasarOn = savedFlag === 'true';
      }
    },
    saveToLocalStorage() {
      localStorage.setItem('quasarOn', this.quasarOn);
    },
    setQuasarOn(value) {
      this.quasarOn = value;
      this.saveToLocalStorage();
    }
  }
});