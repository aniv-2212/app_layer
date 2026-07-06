import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
<<<<<<< HEAD
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
=======

export default defineConfig({
  plugins: [react()],
  base: './',
})
>>>>>>> 715fa5135ef687ab37b4ca9db0a9146dd36af83b
