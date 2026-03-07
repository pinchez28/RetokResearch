import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path'; // <-- import path module

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // <-- '@' points to src folder
    },
  },
});
