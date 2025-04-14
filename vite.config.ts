import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['axios'], // Ensure axios is included
    exclude: ['lucide-react'],
  },
});
