import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCAL_ECOSYSTEM_JSON = path.resolve(__dirname, 'config/ecosystem.json');
const ORCHESTRATOR_ECOSYSTEM_JSON = path.resolve(
    __dirname,
    '../../NEO-PROTOCOL/neobot-orchestrator/config/ecosystem.json'
);
/**
 * Em desenvolvimento local no workspace hub, usa a fonte canônica do orchestrator.
 * Em CI/Vercel, usa o snapshot versionado em smart-ui para evitar ENOENT.
 */
const NEO_ECOSYSTEM_JSON = fs.existsSync(ORCHESTRATOR_ECOSYSTEM_JSON)
    ? ORCHESTRATOR_ECOSYSTEM_JSON
    : LOCAL_ECOSYSTEM_JSON;

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
