import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('error', (err, _req, res) => {
            if (!res.headersSent) {
              res.writeHead(503, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({
                success: false,
                message: 'PHP backend server is not running on port 8000. Please start the backend in a terminal using: npm run server (or php -S 127.0.0.1:8000 -t backend backend/index.php).',
                errors: {
                  code: 'ECONNREFUSED',
                  service: 'PHP Backend API',
                  detail: err.message,
                  hint: 'Open a terminal in VS Code and run: npm run server'
                }
              }));
            }
          });
        }
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          motion: ['framer-motion'],
          lucide: ['lucide-react']
        }
      }
    },
    chunkSizeWarningLimit: 600
  }
});
