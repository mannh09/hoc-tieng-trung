import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Build ra docs/index.html (1 file) → GitHub Pages phục vụ thư mục docs/
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  base: './',
  build: { outDir: 'docs', emptyOutDir: true },
})
