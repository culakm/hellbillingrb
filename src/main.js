import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "@/router";
import utilsPlugin from "./plugins/utilsPlugin.js";
import Container from "./components/ui/Container.vue";

import { Quasar, Loading, Dialog, AppFullscreen } from "quasar";
import "@quasar/extras/material-icons/material-icons.css";
import "quasar/src/css/index.sass";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(utilsPlugin);
app.use(Quasar, { plugins: { Loading, Dialog, AppFullscreen } });

app.component("Container", Container);

app.mount("#app");
