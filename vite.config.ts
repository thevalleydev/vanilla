import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { ssgPlugin } from './plugins/ssg'

export default defineConfig({
  plugins: [
    tailwindcss(),
    ssgPlugin(),
  ],
  server: {
    middlewareMode: false,
  },
  base: '/vanilla/',
})
