import { createApp, defineAsyncComponent } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import VueFullscreen from 'vue-fullscreen';
import utilsPlugin from './plugins/utilsPlugin.js';
import BaseCard from './components/ui/BaseCard.vue';
import BaseButton from './components/ui/BaseButton.vue';
import BaseBadge from './components/ui/BaseBadge.vue';
import BaseSpinner from './components/ui/BaseSpinner.vue';
const BaseDialog = defineAsyncComponent(() => import('./components/ui/BaseDialog.vue'));

import { Quasar } from 'quasar';
import '@quasar/extras/material-icons/material-icons.css';
import 'quasar/src/css/index.sass';

const pinia = createPinia()
const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(VueFullscreen);
app.use(utilsPlugin);
app.use(Quasar, { plugins: {} });

app.component('base-card', BaseCard);
app.component('base-button', BaseButton);
app.component('base-badge', BaseBadge);
app.component('base-spinner', BaseSpinner);
app.component('base-dialog', BaseDialog);

app.mount('#app');