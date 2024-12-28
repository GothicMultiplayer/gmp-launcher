import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
    html: {
        cspNonce: "nonce-TODO"
    },
    build: {
        target: [
            'esnext',
            'node22'
        ],
    },
});
