import { createApp } from 'vue';
import './style.css';
import '@/assets/tailwind.css';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';

// Global signup overlay
import './globalSignup.js';

//  Vue Sonner Toasts
import { Toaster } from 'vue-sonner';
import 'vue-sonner/style.css';

// Import auth store
import { useAuthStore } from './store/auth.js';

const app = createApp(App);

app.use(router);
const pinia = createPinia();
app.use(pinia);

// Register Toaster globally
app.component('Toaster', Toaster);

// Initialize auth from localStorage
const authStore = useAuthStore();
authStore.initialize();

app.mount('#app');
