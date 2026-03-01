# NΞØ SMART FACTORY - Disaster Recovery Runbook

**PHASE 2: Backup & Rollback Strategy**

**Version:** 1.0 | **Last Updated:** 2026-02-05 | **Status:** 🔴 CRITICAL

---

## Quick Reference

| Emergency            | Command                           |
| -------------------- | --------------------------------- |
| **Backup Database**  | `make backup-db`                  |
| **Restore Database** | `make restore-db backup=file.sql` |
| **Snapshot Config**  | `make snapshot-config`            |
| **Rollback System**  | `make rollback commit=hash`       |
| **Pre-Deploy Check** | `make pre-deploy-check`           |

---

## Recovery Objectives

- **RTO (Recovery Time):** 15 minutes (critical) / 1 hour (full)
- **RPO (Data Loss):** Maximum 24 hours

---

## Backup Procedures

### Before Every Deployment

```bash
# 1. Create database backup
make backup-db

# 2. Create configuration snapshot
make snapshot-config

# 3. Run pre-deploy checks
make pre-deploy-check
```

---

## Restore Procedures

### Failed Deployment Rollback

```bash
# 1. Identify last good commit
git log --oneline -10

# 2. Execute rollback
make rollback commit=<hash>

# 3. Confirm by typing: ROLLBACK

# 4. Force push (coordinate with team)
git push origin main --force
```

### Database Corruption Recovery

```bash
# 1. Find recent backup
ls -lt backups/db_backup_*.sql | head -5

# 2. Restore database
make restore-db backup=backups/db_backup_[timestamp].sql

# 3. Verify data integrity
```

---

## Testing Schedule

- **Weekly:** Database backup creation
- **Monthly:** Database restore test (dev environment)
- **Quarterly:** Full disaster recovery drill

---

## Emergency Contacts

- **Vercel Support:** support@vercel.com | https://vercel.com/support
- **Neon Database:** support@neon.tech | https://console.neon.tech
- **Status Pages:** https://vercel-status.com | https://status.neon.tech

---

**Maintenance:** Review quarterly, update after incidents, test regularly
