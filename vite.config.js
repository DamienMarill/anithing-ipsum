import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    allowedHosts: ['*.ngrok.io', '*.ngrok-free.app'],
    // Alternative plus spécifique :
    // allowedHosts: ['*.ngrok.io', '*.ngrok-free.app']
  }
});
