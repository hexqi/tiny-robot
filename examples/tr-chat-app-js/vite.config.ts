import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    proxy: {
      '/modelcontextprotocol-mcp': {
        target: 'https://modelcontextprotocol.io/mcp',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/modelcontextprotocol-mcp/, ''),
      },
    },
  },
})
