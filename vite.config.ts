import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/pages-orginiser/', // Match your GitHub repository name
  assetsInclude: ['**/*.yaml', '**/*.yml'],
})
