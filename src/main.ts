import { createApp } from 'vue'
import './app/style.css'
import App from './App.vue'
import { router } from './app/router'
import { createPinia } from 'pinia';
import { VueQueryPlugin } from '@tanstack/vue-query'
import { queryClient } from './shared/config/vue-query';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App);
const pinia = createPinia();
app.use(router);
app.use(pinia);
app.use(VueQueryPlugin, { queryClient });
app.use(ElementPlus);
app.mount('#app');
