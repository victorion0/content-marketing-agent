import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './'   // THIS LINE FIXES THE WHITE FLASH 100%
})
