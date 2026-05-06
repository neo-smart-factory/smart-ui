# Repository Visibility Policy — NΞØ Smart Factory

**Data:** 2026-01-22  
**Status:** Ativo  
**Categoria:** Política  
**Audiência:** Todos

> **Classification**: SECURITY CRITICAL  
> **Compliance**: MANDATORY

---

## ⚠️ CRITICAL NOTICE

This policy defines **NON-NEGOTIABLE** rules regarding which repositories and information are PUBLIC and which are PRIVATE / NEVER PUBLIC.

**Violation of this policy constitutes a security breach.**

---

## 🟢 PUBLIC REPOSITORIES

The following repositories are **ALLOWED** to be referenced publicly:

### 1. `smart-ui`
**Scope**: Demo and narrative layer only  
**Allowed Content**:
- User interface demonstrations
- Frontend code (no secrets)
- Public-facing documentation
- Architectural decisions (ADRs)

**FORBIDDEN Content**:
- Operational logic
- Security assumptions
- Internal state management
- Roadmap beyond explicitly public scope

---

### 2. `smart-ui-landing`
**Scope**: Marketing and narrative only  
**Allowed Content**:
- Marketing materials
- Public narrative
- Brand assets
- General project description

**FORBIDDEN Content**:
- Technical implementation details
- Internal architecture
- Operational components

---

### 3. `docs`
**Scope**: Architectural decisions and governance only  
**Allowed Content**:
- Architecture Decision Records (ADRs)
- Governance documentation
- Public policies
- Contribution guidelines

**FORBIDDEN Content**:
- Internal operational procedures
- Security-sensitive architecture details
- Infrastructure specifications
- Private roadmap items

---

## 🔴 PRIVATE / RESTRICTED REPOSITORIES

The following repositories **MUST NEVER BE EXPOSED** publicly:

### ❌ `smart-core`
**Classification**: PRIVATE  
**Reason**: Contains operational logic and security assumptions

### ❌ `smart-cli`
**Classification**: PRIVATE  
**Reason**: Contains internal automation and operational tools

### ❌ `internal-ops`
**Classification**: PRIVATE  
**Reason**: Contains operational procedures and infrastructure details

### ❌ Any repository containing:
- Operational logic
- Security assumptions
- Keys, endpoints or infrastructure details
- Internal state or automation
- Roadmap beyond what is explicitly public
- Proprietary algorithms or business logic
- Internal APIs or service definitions
- Deployment configurations
- Monitoring and alerting systems

---

## 🚫 FORBIDDEN ACTIONS

Private/restricted repositories **MUST NOT** be:

- ❌ Linked publicly in any form
- ❌ Mentioned in UI footers
- ❌ Exposed in landing pages
- ❌ Referenced in marketing materials
- ❌ Referenced in pitch materials
- ❌ Implied as open or accessible
- ❌ Listed in public organization pages
- ❌ Mentioned in public documentation
- ❌ Discussed in public forums or issues
- ❌ Included in public dependency graphs

---

## ✅ ALLOWED PUBLIC REFERENCES

Public repositories may be referenced in:

### Landing Pages
- ✓ Link to `smart-ui` repository
- ✓ Link to `smart-ui-landing` repository
- ✓ Link to `docs` repository
- ✓ Link to organization page (filtered view)

### Pitch Materials
- ✓ General project description
- ✓ Public architectural decisions
- ✓ Governance model
- ✓ Demo screenshots/videos

### Public Documentation
- ✓ ADRs (Architecture Decision Records)
- ✓ Contribution guidelines
- ✓ Code of conduct
- ✓ Public roadmap items only

**BUT ONLY within their defined scope.**

---

## 📋 CRITICAL RULES FOR `smart-ui`

### 1. Demo and Narrative Layer Only
The UI is a **DEMO and NARRATIVE layer** only. It demonstrates concepts and captures user intent. It does NOT expose internal operations.

### 2. Forbidden Exposures
The UI **MUST NOT** expose:
- ❌ Internal repositories
- ❌ Operational components
- ❌ CLI existence or details
- ❌ Security-sensitive architecture
- ❌ Internal APIs or endpoints
- ❌ Infrastructure details
- ❌ Deployment configurations

### 3. Footer Content Restrictions
Footer content must reference **ONLY**:
- ✓ The public organization page
- ✓ Explicitly public repositories (`smart-ui`, `smart-ui-landing`, `docs`)
- ✓ Public documentation within scope

### 4. No Exceptions
**No exceptions** to these rules are permitted without explicit governance approval.

---

## 🔒 ENFORCEMENT MECHANISMS

### Code Review
- All pull requests must be reviewed for compliance
- Reviewers must verify no private references are exposed
- Automated checks should flag potential violations

### Documentation Review
- All public documentation must be reviewed
- Links must be validated against this policy
- References to repositories must be verified

### UI/Frontend Review
- Footer links must be validated
- Public-facing content must be audited
- No internal references in client-side code

### Automated Scanning
- Repository references should be scanned
- Links should be validated against allowlist
- Violations should trigger alerts

---

## 📊 COMPLIANCE CHECKLIST

Before any public release or deployment:

- [ ] No references to `smart-core`
- [ ] No references to `smart-cli`
- [ ] No references to `internal-ops`
- [ ] No references to private repositories
- [ ] Footer links validated
- [ ] Documentation links validated
- [ ] No security-sensitive details exposed
- [ ] No internal architecture exposed
- [ ] No infrastructure details exposed
- [ ] No operational logic exposed

---

## 🚨 VIOLATION RESPONSE

### If a violation is detected:

1. **Immediate**: Remove the violating reference
2. **Assess**: Determine scope of exposure
3. **Mitigate**: Implement corrective measures
4. **Document**: Record incident and response
5. **Review**: Update policy if needed
6. **Communicate**: Inform stakeholders as appropriate

### Severity Levels

**CRITICAL**: Exposure of keys, credentials, or security mechanisms  
→ Immediate revocation, incident response, security audit

**HIGH**: Exposure of internal architecture or operational details  
→ Immediate removal, impact assessment, process review

**MEDIUM**: Exposure of private repository names or existence  
→ Prompt removal, documentation update

**LOW**: Ambiguous references that could imply private components  
→ Clarification, documentation improvement

---

## 📝 POLICY UPDATES

This policy may only be updated by:
- Governance approval
- Security team authorization
- Documented decision process

Updates must:
- Maintain or strengthen security posture
- Be documented with rationale
- Be communicated to all stakeholders
- Be versioned and tracked

---

## 🔗 APPROVED PUBLIC REFERENCES

### Organization
✓ https://github.com/neo-smart-factory (filtered public view)

### Repositories
✓ https://github.com/neo-smart-factory/smart-ui  
✓ https://github.com/neo-smart-factory/smart-ui-landing  
✓ https://github.com/neo-smart-factory/docs

### Documentation
✓ Links to files within approved public repositories  
✓ ADRs within `docs` repository  
✓ Public architectural documentation

---

## ⚖️ GOVERNANCE

This policy is enforced by the **neo-smart-factory** governance team.

**Compliance is mandatory.**  
**Security and governance take priority over convenience.**

---

## 📚 RELATED POLICIES

- [ARCHITECTURAL_ADDENDUMS.md](./ARCHITECTURAL_ADDENDUMS.md)
- [ADR 0003: Wallet Extensions & MPC](./adr/0003-wallet-extensions-mpc-automation-posture.md)
- [ADR 0004: KYC & Governance Strategy](./adr/0004-kyc-governance-strategy.md)
- [ORGANIZATION.md](./ORGANIZATION.md)
- [AUDITORIA_VISIBILIDADE_ORGANIZACAO.md](./archive/AUDITORIA_VISIBILIDADE_ORGANIZACAO.md) — Auditoria de conformidade e sugestões (2026-01-24)

---

**END OF POLICY**

**Violations will be treated as security incidents.**
