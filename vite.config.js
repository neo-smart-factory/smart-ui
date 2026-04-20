import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
/** Fonte única: NEO-PROTOCOL/neobot-orchestrator (layout hub neomello) */
const NEO_ECOSYSTEM_JSON = path.resolve(
    __dirname,
    '../../NEO-PROTOCOL/neobot-orchestrator/config/ecosystem.json'
);

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': '/src',
            '@neo-protocol/ecosystem.json': NEO_ECOSYSTEM_JSON,
            // Polyfill Node.js crypto for browser compatibility
            crypto: 'crypto-browserify',
            stream: 'stream-browserify',
            buffer: 'buffer',
        },
        dedupe: [
            'react',
            'react-dom',
            '@dynamic-labs/sdk-react-core',
            '@dynamic-labs/ethereum',
        ],
    },
    define: {
        // Define global for Node.js modules in browser
        global: 'globalThis',
    },
    optimizeDeps: {
        include: [
            '@dynamic-labs/sdk-react-core',
            '@dynamic-labs/ethereum',
            '@dynamic-labs/ethers-v6',
        ],
    },
    build: {
        commonjsOptions: {
            include: [/node_modules/],
            transformMixedEsModules: true,
        },
    },
    server: {
        port: 3000,
        fs: {
            allow: [path.resolve(__dirname, '..'), path.resolve(__dirname, '../../NEO-PROTOCOL')],
        },
        // Note: API routes (/api/*) are Vercel Serverless Functions
        // Use 'vercel dev' or 'npm run dev:vercel' for full API support
        // See DEV_SETUP.md for details
    },
});
