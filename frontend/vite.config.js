import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  let backendUrl = env.VITE_API_URL || 'http://127.0.0.1:8000'
  
  // Si c'est une URL relative (/api) ou si le remplacement vide la chaîne, on utilise localhost
  if (backendUrl.startsWith('/') || backendUrl.replace('/api', '') === '') {
    backendUrl = 'http://127.0.0.1:8000'
  } else {
    backendUrl = backendUrl.replace('/api', '')
  }

  console.log(`\n🚀 Vite Proxy Target: ${backendUrl}\n`)

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: true,
      allowedHosts: true,
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
        },
        '/storage': {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
        }
      }
    }
  }
})