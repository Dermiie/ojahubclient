import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // '' = load all variables, not only VITE_ ones (API_PROXY_TARGET stays out of the browser bundle)
  const env = loadEnv(mode, process.cwd(), '');

  console.log('API_PROXY_TARGET =', env.API_PROXY_TARGET);

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: true,
      open: true,
      allowedHosts: ['localhost', '0.0.0.0'],
      proxy: {
        '/api': {
          target: env.API_PROXY_TARGET || 'https://ojahub-backend.onrender.com',
          changeOrigin: true, // required for Render: it routes requests by hostname
          cookieDomainRewrite: { '*': '' }, // keep the session cookie on localhost
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              // The backend's CORS allows only :5173. Through the proxy the browser
              // never makes a cross-origin request anyway, so this is safe in dev.
              proxyReq.setHeader('origin', 'http://localhost:5173');
            });
          },
        },
      },
    },
  };
});
