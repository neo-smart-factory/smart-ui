#!/usr/bin/env node
import postgres from "postgres";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

// Color codes for terminal output
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RED = "\x1b[31m";
const CYAN = "\x1b[36m";
const NC = "\x1b[0m"; // No Color

if (!connectionString) {
  console.error(`${RED}❌ DATABASE_URL ou DIRECT_URL não definida.${NC}`);
  console.error(
    '   Use: DATABASE_URL="postgresql://..." node scripts/backup-database.js'
  );
  console.error("   Ou: cp .env.example .env && preencha DATABASE_URL");
  process.exit(1);
}

// Create backups directory if it doesn't exist
const backupDir = path.join(__dirname, "../backups");
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

const sql = postgres(connectionString, { max: 1 });

async function backupDatabase() {
  console.log(`${CYAN}========================================${NC}`);
  console.log(`${CYAN}🔒 NΞØ DATABASE BACKUP - PHASE 2${NC}`);
  console.log(`${CYAN}========================================${NC}`);
  console.log("");

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupFile = path.join(backupDir, `db_backup_${timestamp}.sql`);

  try {
    console.log(`${YELLOW}📊 Analyzing database structure...${NC}`);

    // Get list of all tables
    const tables = await sql`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename
    `;

    console.log(`${GREEN}✓ Found ${tables.length} tables${NC}`);
    console.log("");

    let backupContent = "";
    backupContent += `-- NΞØ SMART FACTORY DATABASE BACKUP\n`;
    backupContent += `-- Generated: ${new Date().toISOString()}\n`;
    backupContent += `-- Database: ${
      connectionString.split("@")[1]?.split("/")[1] || "neo_smart_factory"
    }\n`;
    backupContent += `-- Tables: ${tables.length}\n`;
    backupContent += `--\n`;
    backupContent += `-- WARNING: This backup is for disaster recovery only.\n`;
    backupContent += `-- Review all data before restoring to production.\n`;
    backupContent += `\n\n`;

    // Backup each table
    for (const { tablename } of tables) {
      console.log(`${YELLOW}📦 Backing up table: ${tablename}${NC}`);

      // Get row count
      const countResult = await sql`
        SELECT COUNT(*)::int as count
        FROM ${sql(tablename)}
      `;
      const rowCount = countResult[0].count;

      backupContent += `-- ============================================\n`;
      backupContent += `-- Table: ${tablename}\n`;
      backupContent += `-- Rows: ${rowCount}\n`;
      backupContent += `-- ============================================\n\n`;

      // Get all data from table
      const rows = await sql`SELECT * FROM ${sql(tablename)}`;

      if (rows.length > 0) {
        const columnNames = Object.keys(rows[0]);

        // Generate INSERT statements
        for (const row of rows) {
          const values = columnNames
            .map((col) => {
              const val = row[col];
              if (val === null) return "NULL";
              if (typeof val === "string") {
                return `'${val.replace(/'/g, "''")}'`;
              }
              if (val instanceof Date) {
                return `'${val.toISOString()}'`;
              }
              if (typeof val === "object") {
                return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
              }
              return val;
            })
            .join(", ");

          backupContent += `INSERT INTO ${tablename} (${columnNames.join(
            ", "
          )}) VALUES (${values});\n`;
        }

        backupContent += `\n`;
      }

      console.log(`${GREEN}  ✓ Backed up ${rowCount} rows${NC}`);
    }

    // Write backup to file
    fs.writeFileSync(backupFile, backupContent, "utf8");

    console.log("");
    console.log(`${CYAN}========================================${NC}`);
    console.log(`${GREEN}✅ BACKUP COMPLETE${NC}`);
    console.log(`${CYAN}========================================${NC}`);
    console.log("");
    console.log(`📁 Backup saved to:`);
    console.log(`   ${backupFile}`);
    console.log("");
    console.log(`📊 Backup statistics:`);
    console.log(`   Tables: ${tables.length}`);
    console.log(
      `   Size: ${(fs.statSync(backupFile).size / 1024).toFixed(2)} KB`
    );
    console.log("");
    console.log(`${YELLOW}⚠️  IMPORTANT:${NC}`);
    console.log(`   - Store this backup securely`);
    console.log(`   - Test restore procedure regularly`);
    console.log(`   - Keep multiple backup versions`);
    console.log(`   - Backups contain sensitive data - handle carefully`);
    console.log("");
  } catch (err) {
    console.error(`${RED}❌ Backup failed:${NC}`, err.message);
    console.error("");
    console.error(`${YELLOW}Troubleshooting:${NC}`);
    console.error("  1. Verify DATABASE_URL is correct");
    console.error("  2. Check network connectivity to Neon");
    console.error("  3. Verify database permissions");
    console.error("");
    process.exit(1);
  } finally {
    await sql.end();
  }
}

// Run backup
backupDatabase().catch((err) => {
  console.error(`${RED}Fatal error:${NC}`, err);
  process.exit(1);
});
