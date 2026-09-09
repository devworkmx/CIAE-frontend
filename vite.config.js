import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // Escucha en 0.0.0.0 (accesible desde cualquier celular en la misma Wi-Fi)
    port: 5173,
  },
})
