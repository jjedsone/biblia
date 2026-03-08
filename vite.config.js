import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/biblia/' : '/',
  plugins: [react()],
  server: {
    proxy: {
      '/api-biblia': {
        target: 'https://bible-api.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-biblia/, ''),
      },
      '/biblia-pt.json': {
        target: 'https://raw.githubusercontent.com',
        changeOrigin: true,
        rewrite: () => '/thiagobodruk/biblia/master/json/nvi.json',
      },
    },
  },
})
