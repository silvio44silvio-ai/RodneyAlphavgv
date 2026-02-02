
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import process from 'node:process';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    base: '/',
    define: {
      // Injeta a API_KEY do sistema no build
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ""),
      'process.env.NODE_ENV': JSON.stringify(mode)
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: false,
      minify: 'esbuild',
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-icons': ['lucide-react'],
            'vendor-ai': ['@google/genai'],
            'vendor-charts': ['recharts']
          }
        }
      }
    },
    server: {
      historyApiFallback: true,
      port: 3000
    }
  };
});
