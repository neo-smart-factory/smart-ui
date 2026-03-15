#!/usr/bin/env node
/**
 * NΞØ SMART FACTORY - Database Restore Script
 *
 * Restores a database backup created by backup-database.js
 *
 * Usage:
 *   node scripts/restore-database.js backups/db_backup_[timestamp].sql
 *   Or: make restore-db backup=backups/db_backup_[timestamp].sql
 *
 * Requirements:
 *   - DATABASE_URL environment variable
 *   - Node.js with postgres library
 *   - Backup file path as argument
 *
 * ⚠️  DANGER: This will OVERWRITE existing data in the database
 * ONLY use this for disaster recovery or in development/staging
 */

import postgres from 'postgres';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

// Color codes
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';
const NC = '\x1b[0m';

if (!connectionString) {
  console.error(`${RED}❌ DATABASE_URL ou DIRECT_URL não definida.${NC}`);
  process.exit(1);
}

const backupFile = process.argv[2];

if (!backupFile) {
  console.error(`${RED}❌ Backup file path required.${NC}`);
  console.error('Usage: node scripts/restore-database.js backups/db_backup_[timestamp].sql');
  process.exit(1);
}

// Prevenir path traversal: garantir que o arquivo está dentro do diretório de backups
const resolvedBackupPath = path.resolve(backupFile);
const allowedBackupDir = path.resolve(__dirname, '../backups');
const relativeBackupPath = path.relative(allowedBackupDir, resolvedBackupPath);
if (
  relativeBackupPath === '' ||
  relativeBackupPath === '.' ||
  relativeBackupPath === path.sep
) {
  // OK: path is exactly the allowed backup directory
} else if (
  relativeBackupPath.startsWith('..' + path.sep) ||
  relativeBackupPath === '..' ||
  path.isAbsolute(relativeBackupPath)
) {
  console.error(`${RED}❌ Caminho de backup inválido. O arquivo deve estar dentro de: ${allowedBackupDir}${NC}`);
  process.exit(1);
}

if (!fs.existsSync(resolvedBackupPath)) {
  console.error(`${RED}❌ Backup file not found: ${resolvedBackupPath}${NC}`);
  process.exit(1);
}

const sql = postgres(connectionString, { max: 1 });

async function askConfirmation(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'yes');
    });
  });
}

async function restoreDatabase() {
  console.log(`${CYAN}========================================${NC}`);
  console.log(`${RED}⚠️  DATABASE RESTORE - PHASE 2${NC}`);
  console.log(`${CYAN}========================================${NC}`);
  console.log('');
  console.log(`${YELLOW}WARNING: This operation will OVERWRITE existing database data.${NC}`);
  console.log(`${YELLOW}Only proceed if you are certain you want to restore from backup.${NC}`);
  console.log('');
  console.log(`Backup file: ${backupFile}`);
  console.log(`Database: ${connectionString.split('@')[1]?.split('/')[1] || 'neo_smart_factory'}`);
  console.log('');

  // Safety check - require explicit confirmation
  const confirmed = await askConfirmation(`${RED}Type 'yes' to confirm restore (any other input will abort): ${NC}`);

  if (!confirmed) {
    console.log(`${YELLOW}❌ Restore aborted by user.${NC}`);
    process.exit(0);
  }

  try {
    console.log('');
    console.log(`${YELLOW}📖 Reading backup file...${NC}`);
    const backupContent = fs.readFileSync(resolvedBackupPath, 'utf8');

    // Parse SQL statements
    const statements = backupContent
      .split('\n')
      .filter(line => !line.startsWith('--') && line.trim().length > 0)
      .join('\n')
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    console.log(`${GREEN}✓ Found ${statements.length} SQL statements${NC}`);
    console.log('');
    console.log(`${YELLOW}🔄 Restoring data...${NC}`);

    let successCount = 0;
    let errorCount = 0;

    for (const statement of statements) {
      try {
        await sql.unsafe(statement + ';');
        successCount++;
        if (successCount % 10 === 0) {
          process.stdout.write(`${GREEN}✓${NC}`);
        }
      } catch (err) {
        errorCount++;
        console.error(`${RED}✗ Error executing statement:${NC}`, err.message);
        console.error(`Statement: ${statement.substring(0, 100)}...`);
      }
    }

    console.log('');
    console.log('');
    console.log(`${CYAN}========================================${NC}`);
    console.log(`${GREEN}✅ RESTORE COMPLETE${NC}`);
    console.log(`${CYAN}========================================${NC}`);
    console.log('');
    console.log(`📊 Restore statistics:`);
    console.log(`   Successful: ${successCount}`);
    console.log(`   Errors: ${errorCount}`);
    console.log('');

    if (errorCount > 0) {
      console.log(`${YELLOW}⚠️  Some statements failed during restore.${NC}`);
      console.log(`   This may be expected (e.g., duplicate keys).`);
      console.log(`   Review the errors above and verify data integrity.`);
    }

    console.log(`${GREEN}✓ Database restored from backup${NC}`);
    console.log('');

  } catch (err) {
    console.error(`${RED}❌ Restore failed:${NC}`, err.message);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

// Run restore
restoreDatabase().catch(err => {
  console.error(`${RED}Fatal error:${NC}`, err);
  process.exit(1);
}); `` `
/**
 * NΞØ SMART FACTORY - Database Backup Script
 *
 * Creates a complete backup of the PostgreSQL database (Neon)
 * Saves backup to: backups/db_backup_[timestamp].sql
 *  
 * Usage:
 *   node scripts/backup-database.js
 *   Or: make backup-db
 *
 * Requirements:
 *   - DATABASE_URL environment variable
 *   - Node.js with postgres library
 *
 * CRITICAL: This script is READ-ONLY and creates backups for disaster recovery
 */
` ``;

