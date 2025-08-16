import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://victoria-backend.onrender.com", // 👈 your backend URL
        changeOrigin: true,
        secure: false
      }
    }
  }
});
