import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import process from 'process'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root:'client',
  build:{
    outDir: path.join(process.cwd(),'dist/client')
  }
})
