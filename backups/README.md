# Backups Directory

This directory stores critical backups for disaster recovery.

## 📁 File Patterns

- `db_backup_[timestamp].sql` - Database backups
- `config_snapshot_[timestamp].tar.gz` - Configuration snapshots
- `emergency_[timestamp]/` - Emergency backups (from rollback)

## 🔒 Security

⚠️ **Contains sensitive data** - DO NOT commit to git or share publicly

## 📦 Quick Commands

```bash
# Create backups
make backup-db
make snapshot-config

# Restore
make restore-db backup=backups/db_backup_[timestamp].sql
```

## 🔄 Retention

- Database: 30 days
- Config: 10 snapshots
- Test restore monthly

See [Disaster Recovery Runbook](../docs/DISASTER_RECOVERY_RUNBOOK.md)
