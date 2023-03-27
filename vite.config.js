import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [svgr(), react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/__tests__/setup.js',
        coverage: {
            reporter: ['text', 'json', 'html'],
        },
    },
});
