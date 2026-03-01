/**
 * Database migrations — Marketing & Analytics Schema
 * Run: DATABASE_URL=... node scripts/migrate-marketing.js
 * Or: make migratedb-marketing (with .env loaded)
 */
import postgres from "postgres";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ DATABASE_URL ou DIRECT_URL não definida.");
  console.error(
    '   Use: DATABASE_URL="postgresql://..." node scripts/migrate-marketing.js'
  );
  console.error("   Ou: cp .env.example .env && preencha DATABASE_URL");
  process.exit(1);
}

const sql = postgres(connectionString, { max: 1 });

async function runMigrations() {
  console.log("🚀 Iniciando migração de Marketing & Analytics...");

  try {
    const migrationPath = path.join(
      __dirname,
      "../migrations/02_marketing_analytics.sql"
    );
    const migrationSql = fs.readFileSync(migrationPath, "utf8");

    // Executar SQL completo de uma vez (mais seguro para views complexas)
    console.log("📝 Executando migration SQL...");

    try {
      await sql.unsafe(migrationSql);
      console.log("✅ Schema de Marketing & Analytics criado com sucesso!");
    } catch (err) {
      // Se falhar, tentar executar statement por statement
      if (
        err.message.includes("syntax error") ||
        err.message.includes("unexpected")
      ) {
        console.log("⚠️  Executando statement por statement...");

        // Dividir em statements válidos (separados por ; no final da linha ou bloco)
        const statements = migrationSql
          .split(/(?<=;)\s*(?=\n|$)/)
          .map((s) => s.trim())
          .filter((s) => s.length > 0 && !s.match(/^\s*--/));

        for (let i = 0; i < statements.length; i++) {
          const stmt = statements[i];
          if (stmt.length > 0) {
            try {
              await sql.unsafe(stmt);
              console.log(
                `  ✅ Statement ${i + 1}/${statements.length} executado`
              );
            } catch (stmtErr) {
              if (
                stmtErr.message.includes("already exists") ||
                stmtErr.message.includes("duplicate key")
              ) {
                console.log(`  ⚠️  Statement ${i + 1} já existe (ignorado)`);
              } else {
                console.error(
                  `  ❌ Erro no statement ${i + 1}:`,
                  stmtErr.message
                );
                throw stmtErr;
              }
            }
          }
        }
      } else {
        throw err;
      }
    }

    // Verificar tabelas criadas
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name IN ('leads', 'user_sessions', 'email_subscriptions', 'conversion_events')
      ORDER BY table_name
    `;

    console.log(
      `📊 Tabelas criadas: ${tables.map((t) => t.table_name).join(", ")}`
    );

    // Verificar views criadas
    const views = await sql`
      SELECT table_name as view_name
      FROM information_schema.views 
      WHERE table_schema = 'public'
        AND table_name IN ('abandoned_leads', 'conversion_funnel', 'marketable_leads')
      ORDER BY table_name
    `;

    if (views.length > 0) {
      console.log(
        `📈 Views criadas: ${views.map((v) => v.view_name).join(", ")}`
      );
    }
  } catch (err) {
    console.error("❌ Falha na migração:", err.message);
    if (err.detail) {
      console.error("   Detalhes:", err.detail);
    }
    if (err.position) {
      console.error("   Posição do erro:", err.position);
    }
    process.exit(1);
  } finally {
    await sql.end();
  }
}

runMigrations();
