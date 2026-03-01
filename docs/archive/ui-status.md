# Smart UI — Status Document

> **⚠️ ARCHIVED DOCUMENT**  
> This document is preserved for historical reference. The content reflects the state of the project at the time of archiving and may contain outdated nomenclature (e.g., "forge" instead of "deploy/smart"). Please refer to current documentation for up-to-date information.

**Data:** 2026-01-24  
**Status:** Ativo  
**Categoria:** Arquitetura  
**Audiência:** Todos

> **Repository:** smart-ui  
> **Status:** Frozen (Demo & Intent Layer)  
> **Last Decision:** ADR 0002  
> **Authority:** docs

---

## 1. Current Role

The Smart UI is officially classified as a:

**Demo and Intent Layer**

It exists to:

- demonstrate user flows
- visualize protocol concepts
- collect configuration intent
- support founder-facing demos and previews

It does **not** represent protocol authority.

---

## 2. Authority Clarification

The Smart UI has **no authority** over:

- protocol logic
- token economics
- transaction execution
- on-chain state
- lifecycle enforcement

All protocol authority lives in:

- `smart-core`
- `smart-cli`
- `docs`

The UI reflects decisions.  
It does not make them.

---

## 3. Transitional Components

The following elements exist for **demo purposes only**:

- API routes inside the UI
- Local database persistence
- Simulated deployments
- Mock transaction hashes
- Local validation rules
- Cross-repo filesystem reads

These components:

- are non-authoritative
- must not be expanded
- must not be reused as backend infrastructure

---

## 4. Change Policy

The Smart UI is currently **frozen**.

Allowed changes:

- critical build fixes
- dependency security patches
- explicit demo labeling

Forbidden changes:

- new features
- new integrations
- protocol logic additions
- backend expansion
- architectural refactors

Any exception requires a new ADR.

---

## 5. Integration Outlook

Future integration with real protocol state will occur only via:

- `smart-cli`
- explicitly documented read-only contracts

No direct integration with `smart-core` is permitted.

---

## 6. Final Statement

**The Smart UI is a window, not an engine.  
It shows the system.  
It does not run it.**
