import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'render': [
            './src/render/index.js',
            './src/render/squad.js',
            './src/render/summary.js',
            './src/render/stats.js',
            './src/render/result.js',
            './src/render/other.js',
            './src/render/tabs.js',
            './src/render/hero.js',
            './src/render/nav.js',
            './src/render/utils.js'
          ],
          'core': [
            './src/store.js',
            './src/i18n.js',
            './src/parser.js',
            './src/config.js'
          ]
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
});
