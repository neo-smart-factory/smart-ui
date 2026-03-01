# PHASE 2 - Pre-Modification Checklist

**NΞØ SMART FACTORY - Backup & Rollback Strategy**

Use this checklist before ANY production modification or deployment.

---

## 🔴 CRITICAL - Before ANY Change

### 1. Pre-Deployment Validation

```bash
make pre-deploy-check
```

**Expected Result:** ✅ All checks passed

**If Failed:**

- [ ] Fix all errors before proceeding
- [ ] Review warnings and assess risk
- [ ] Document any exceptions

---

### 2. Create Database Backup

```bash
make backup-db
```

**Verify:**

- [ ] Backup file created in `backups/` directory
- [ ] File size > 0 bytes
- [ ] Timestamp in filename is current

**Expected Output:**

```
✅ BACKUP COMPLETE
📁 Backup saved to: backups/db_backup_[timestamp].sql
```

---

### 3. Create Configuration Snapshot

```bash
make snapshot-config
```

**Verify:**

- [ ] Snapshot archive created in `backups/` directory
- [ ] Archive contains all critical config files
- [ ] Git status captured

**Expected Output:**

```
✅ SNAPSHOT COMPLETE
📁 Snapshot saved to: backups/config_snapshot_[timestamp].tar.gz
```

---

### 4. Document Change

**Record the following:**

- [ ] Git commit hash of current state: `git rev-parse HEAD`
- [ ] Purpose of change: **********\_**********
- [ ] Expected impact: **********\_**********
- [ ] Rollback plan: **********\_**********
- [ ] Estimated time: **********\_**********

**Save to:**

- Deployment log (manual or automated)
- Team communication channel (Slack, email)

---

### 5. Communication

**Notify team:**

- [ ] Change description
- [ ] Time window
- [ ] Expected impact
- [ ] Point of contact

**Template:**

```
🚀 DEPLOYMENT NOTICE

Change: [Description]
Time: [Start - End]
Impact: [Expected downtime/changes]
Rollback: Prepared and tested
Contact: [Your name]
```

---

## 🟡 DURING Modification

### Monitoring

- [ ] Keep terminal/dashboard open to monitor deployment
- [ ] Watch Vercel deployment logs
- [ ] Monitor error rates (if available)
- [ ] Test critical functionality immediately after deploy

### Rollback Readiness

**Have ready:**

- [ ] Terminal window with project open
- [ ] Git commit hash documented
- [ ] Database backup path documented
- [ ] Rollback command ready to execute

**Rollback Command:**

```bash
make rollback commit=[last-good-commit] backup=[db-backup-file]
```

---

## 🟢 AFTER Modification

### 1. Verification

- [ ] Application loads successfully
- [ ] API endpoints responding
- [ ] Database queries working
- [ ] No error spikes in logs

**Quick Test:**

```bash
# Test API health
curl https://smart-ui-delta.vercel.app/api/ops?action=status

# Expected: {"status":"operational","version":"0.5.5",...}
```

### 2. Monitoring Period

**Monitor for 15 minutes:**

- [ ] No errors in Vercel logs
- [ ] No user complaints
- [ ] Normal traffic patterns
- [ ] Database performance stable

### 3. Documentation

**Update:**

- [ ] Deployment log with results
- [ ] Team notification (success/failure)
- [ ] Document any issues encountered
- [ ] Update runbook if procedures changed

### 4. Cleanup (After 7 Days)

**If deployment successful:**

- [ ] Keep last 3 database backups
- [ ] Keep last 3 config snapshots
- [ ] Archive older backups to long-term storage
- [ ] Clean up emergency backups

---

## 🔴 EMERGENCY - If Something Goes Wrong

### Immediate Actions

1. **STOP the deployment** (if in progress)
2. **Assess severity:** SEV-1 (critical) to SEV-4 (minor)
3. **Notify team immediately**
4. **Start incident timer**

### For SEV-1 (Critical Outage)

**Execute rollback immediately:**

```bash
# 1. Identify last good commit
git log --oneline -5

# 2. Execute rollback
make rollback commit=[last-good-commit]

# 3. Confirm rollback (type: ROLLBACK)

# 4. Force push to production
git push origin main --force
```

**Expected Duration:** 10-20 minutes

### For SEV-2/3 (Degraded Performance)

1. **Assess if rollback needed**
2. **Attempt hot-fix if possible**
3. **If hot-fix fails:** Execute rollback
4. **Document issue for post-mortem**

---

## 📋 Quick Reference

| Situation                 | Command                     |
| ------------------------- | --------------------------- |
| **Pre-deploy validation** | `make pre-deploy-check`     |
| **Backup database**       | `make backup-db`            |
| **Snapshot config**       | `make snapshot-config`      |
| **Deploy**                | `make deploy msg="..."`     |
| **Rollback**              | `make rollback commit=HASH` |
| **Test APIs**             | `make test-apis-prod`       |
| **Check health**          | `make health`               |

---

## 📚 Related Documentation

- [Disaster Recovery Runbook](./DISASTER_RECOVERY_RUNBOOK.md)
- [Architecture & Workflows](./ARCHITECTURE_WORKFLOWS_AND_DEPLOYMENT.md)
- [Safe Deploy Script](../scripts/safe-deploy.sh)

---

**Remember:**

- ✅ Backup BEFORE every change
- ✅ Validate BEFORE every deployment
- ✅ Monitor DURING every deployment
- ✅ Document AFTER every deployment
- ✅ Test rollback procedures regularly

**When in doubt:** Create a backup. It's always safer to have one and not need it than to need one and not have it.
