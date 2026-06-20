import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'dist/lib',
    emptyOutDir: true,
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      name: 'NiteKit',
      fileName: (format) => (format === 'es' ? 'nitekit.js' : 'nitekit.umd.cjs'),
      cssFileName: 'nitekit',
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
