import { createApp } from 'vue';
import './style.css';
import '@/assets/tailwind.css';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';

// Import global signup overlay function
import './globalSignup.js'; // <-- add this

const app = createApp(App);

app.use(router);
app.use(createPinia());

app.mount('#app');
