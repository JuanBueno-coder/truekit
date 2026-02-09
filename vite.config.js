import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/truekit/',  // ← Cambia 'truekit' por el nombre de tu repositorio
})
