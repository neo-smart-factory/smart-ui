/**
 * NΞØ Smart Factory — Dynamic API Connectivity Test
 *
 * Este script verifica se o Environment ID do Dynamic.xyz configurado no .env
 * é válido e se a API está respondendo corretamente.
 *
 * Versão: No-dependencies (v20+ native fetch)
 */

import fs from "fs";
import path from "path";

async function testDynamicConnectivity() {
  console.log("\n[DEBUG] Iniciando teste de conectividade Dynamic.xyz...");

  // Carregar .env manualmente para evitar dependências extras
  let envId = null;
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, "utf8");
      const match = envContent.match(
        /VITE_DYNAMIC_ENVIRONMENT_ID=["']?([^"'\s]+)["']?/
      );
      if (match) envId = match[1];
    }
  } catch (e) {
    console.warn("[AVISO] Erro ao ler .env manualmente:", e.message);
  }

  // Fallback se não encontrar
  envId = envId || process.env.VITE_DYNAMIC_ENVIRONMENT_ID;

  console.log(
    `[DEBUG] ID detectado: ${
      envId ? envId.slice(0, 8) + "..." : "NÃO ENCONTRADO"
    }`
  );

  if (!envId) {
    console.error(
      "[ERRO] VITE_DYNAMIC_ENVIRONMENT_ID não encontrado no arquivo .env"
    );
    process.exit(1);
  }

  // Endpoint de configuração pública do Dynamic
  const url = `https://app.dynamic.xyz/api/v0/sdk/${envId}/config`;

  try {
    const response = await fetch(url);

    if (response.ok) {
      const data = await response.json();
      console.log("\n✅ SUCESSO: API do Dynamic está acessível!");
      console.log(`[INFO] App Name: ${data.environment?.name || "N/A"}`);
      console.log(`[INFO] Status: Ativo`);
      console.log(`[INFO] Project ID: ${data.environment?.projectId || "N/A"}`);
    } else {
      const errorText = await response.text();
      console.error(`\n❌ ERRO: A API retornou status ${response.status}`);
      console.error(`[DETALHE] ${errorText}`);

      if (response.status === 403 || response.status === 401) {
        console.error(
          "\n[DICA] O Environment ID pode estar incorreto ou as restrições de domínio estão bloqueando este acesso."
        );
      }
    }
  } catch (error) {
    console.error(
      "\n❌ ERRO DE CONEXÃO: Não foi possível alcançar a API do Dynamic."
    );
    console.error(`[DETALHE] ${error.message}`);
  }
}

testDynamicConnectivity();
