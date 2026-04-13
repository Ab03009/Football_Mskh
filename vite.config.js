import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Оставляем base пустым или './', чтобы стили искались в текущей папке
  base: './', 
})