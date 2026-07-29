import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  build: {
    // three.js tek başına büyük — ayrı chunk'a alarak ana bundle'ı küçük tut.
    // SSR-buildissa (vite-react-ssg prerender) three on external, joten
    // manualChunks pätee vain client-buildiin.
    rollupOptions: isSsrBuild
      ? undefined
      : {
          output: {
            manualChunks: {
              three: ['three', '@react-three/fiber', '@react-three/drei'],
            },
          },
        },
  },
}))
