import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Relative asset paths so the build works whether it's served from a
  // domain root (custom domain) or a GitHub Pages project subpath
  // (username.github.io/repo-name/) — safe with HashRouter either way.
  base: './',
})
