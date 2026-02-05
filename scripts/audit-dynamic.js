/**
 * NΞØ Smart Factory — Dynamic API Audit
 * 
 * Este script testa a validade do Environment ID em múltiplos domínios da Dynamic.
 */

import fs from 'fs';
import path from 'path';

async function auditDynamic() {
    console.log('\n[AUDIT] Iniciando auditoria de conectividade Dynamic.xyz...');

    let envId = null;
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf8');
            const match = envContent.match(/VITE_DYNAMIC_ENVIRONMENT_ID=["']?([^"'\s]+)["']?/);
            if (match) envId = match[1];
        }
    } catch (e) {
        console.warn('[AVISO] Erro ao ler .env:', e.message);
    }

    envId = envId || process.env.VITE_DYNAMIC_ENVIRONMENT_ID;

    if (!envId) {
        console.error('[ERRO] VITE_DYNAMIC_ENVIRONMENT_ID não configurado.');
        return;
    }

    console.log(`[AUDIT] Environment ID: ${envId}`);

    const domains = [
        'app.dynamic.xyz',
        'app.dynamicauth.com',
        'api.dynamic.xyz',
        'api.dynamicauth.com'
    ];

    for (const domain of domains) {
        const url = `https://${domain}/api/v0/sdk/${envId}/config`;
        console.log(`\n[TEST] Tentando: ${url}`);

        try {
            const response = await fetch(url, {
                headers: {
                    'Origin': 'http://localhost:3000',
                    'Referer': 'http://localhost:3000/'
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log(`✅ SUCESSO (${domain}): API respondendo.`);
                console.log(`   App: ${data.environment?.name}`);
                console.log(`   Status: ${data.environment?.status || 'Active'}`);
            } else {
                console.log(`❌ FALHA (${domain}): Status ${response.status}`);
                const text = await response.text();
                console.log(`   Detalhe: ${text.slice(0, 100)}`);
            }
        } catch (e) {
            console.log(`❌ ERRO (${domain}): ${e.message}`);
        }
    }
}

auditDynamic();
