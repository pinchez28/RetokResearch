import { createApp } from 'vue';
import './style.css';
import '@/assets/tailwind.css';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';

// Global signup overlay
import './globalSignup.js';

// ✅ Vue Sonner Toasts
import { Toaster } from 'vue-sonner';
import 'vue-sonner/style.css';

const app = createApp(App);

app.use(router);
app.use(createPinia());

// Register Toaster globally
app.component('Toaster', Toaster);

app.mount('#app');
