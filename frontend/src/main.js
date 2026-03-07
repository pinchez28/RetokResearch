import { createApp } from 'vue';
import './style.css';
import '@/assets/css/tailwind.css';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import { setAccessToken } from '@/core/api/http';
import './globalSignup.js';

import { Toaster } from 'vue-sonner';
import 'vue-sonner/style.css';
import { useThemeStore } from '@/core/store/themeStore.js';

import { initNotificationSocket } from '@/core/socket/notificationSocket';

import '@fontsource/pacifico';

const app = createApp(App);

/* ---------------- Pinia ---------------- */
const pinia = createPinia();
app.use(pinia);

/* ---------------- Router ---------------- */
app.use(router);

/* ---------------- Global Components ---------------- */
app.component('Toaster', Toaster);

/* ---------------- Global Error Handler ---------------- */
app.config.errorHandler = (err, instance, info) => {
  console.error('🔥 Vue error:', err);
  console.error('📍 Component:', instance?.type?.name ?? instance);
  console.error('ℹ️ Info:', info);
  console.error('💡 Full instance:', instance);
};

/* ---------------- Restore Token & Initialize API ---------------- */
const token = localStorage.getItem('token');
if (token) {
  setAccessToken(token);
}

/* ---------------- Initialize Theme Store ---------------- */
const themeStore = useThemeStore();
// Optional: call an init method if you have one
// themeStore.initTheme?.();

/* ---------------- Initialize Chat Socket ---------------- */
// Only init socket if user is logged in (token exists)
if (token) {
  const userRole = themeStore.userRole || 'Client'; // fallback if role not in store
  initNotificationSocket({ role: userRole });
}

/* ---------------- Mount App ---------------- */
app.mount('#app');
