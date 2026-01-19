import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { ssgPlugin } from './plugins/ssg'

export default defineConfig(({ mode }) => ({
  plugins: [
    tailwindcss(),
    ssgPlugin(),
  ],
  server: {
    middlewareMode: false,
  },
  base: mode === 'production' ? '/vanilla/' : '/',
}))
