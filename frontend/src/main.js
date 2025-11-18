import { createApp } from 'vue';
import './style.css';
import '@/assets/tailwind.css';
import App from './App.vue';
import router from './router'; // ✅ import router
import { createPinia } from 'pinia'; // ✅ import Pinia if using store

const app = createApp(App);

app.use(router); // ✅ make router available
app.use(createPinia()); // ✅ make store available

app.mount('#app');
