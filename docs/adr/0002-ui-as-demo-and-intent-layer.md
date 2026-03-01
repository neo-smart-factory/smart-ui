# ADR 0002 — Smart UI as Demo and Intent Layer

**Status:** Accepted  
**Date:** 2026-01-21  
**Versão:** 1.0.0  
**Deciders:** NΞØ Architecture  
**Applies to:** smart-ui, smart-cli, smart-core, internal-ops

---

## Context

The current `smart-ui` codebase contains:

- simulated deployments
- temporary backend logic
- local persistence
- placeholder protocol assumptions

This was intentional during early exploration and validation.

However, allowing the UI to evolve without explicit boundaries creates risk of:

- frontend-driven protocol decisions
- hidden coupling with backend logic
- misrepresentation of protocol authority
- AI-assisted drift beyond architectural intent

A formal decision is required to **freeze the role of the Smart UI**.

---

## Decision

The `smart-ui` is formally designated as a:

**Demo and Intent Layer**

It exists to:

- demonstrate flows
- collect user intent
- visualize system state
- support founder-facing demos

It does **not** represent protocol truth.

---

## Defined Responsibilities

### Smart UI MAY:

- Render simulated or real state
- Collect configuration inputs
- Display outputs produced by CLI
- Operate in explicit demo or simulation modes
- Persist temporary, non-authoritative data

---

### Smart UI MUST NOT:

- Deploy contracts
- Construct or sign transactions
- Enforce protocol rules
- Define token economics
- Assume backend authority
- Read protocol state directly from filesystem or core

Any such behavior is considered **transitional** and non-authoritative.

---

## Transitional Components (Explicit)

The following patterns are acknowledged as temporary:

- API routes inside the UI
- Direct database access
- Mock transaction generation
- Local protocol assumptions (fees, lifecycle steps)
- Cross-repo filesystem reads

These components:

- are allowed only for demo purposes
- must not be expanded
- must not be treated as production infrastructure

---

## Authority Model

| Layer      | Authority Level       |
| ---------- | --------------------- |
| smart-core | Protocol authority    |
| smart-cli  | Operational authority |
| docs       | Decision authority    |
| smart-ui   | No authority          |

The UI reflects decisions.  
It does not make them.

---

## Consequences

### Positive

- UI can be used safely for demos and sales
- No risk of protocol contamination
- Architecture remains backend-driven
- AI agents have clear constraints

### Negative

- UI cannot be used as a production backend
- Extra integration work required later
- Some duplication remains temporarily

These trade-offs are intentional and accepted.

---

## Enforcement

This ADR is enforced by:

- `integration-map.md`
- `workflow.md`
- CI boundary rules
- Human review

Violations invalidate Pull Requests.

---

## Migration Path (Future)

A future ADR will define:

- CLI-exposed read-only endpoints
- UI consumption contracts
- Removal of demo-only backend logic

No migration work is allowed before such ADR exists.

---

## Notes for AI Assistants

AI agents must:

- treat the UI as non-authoritative
- avoid adding protocol logic to UI
- flag any request that implies UI authority
- wait for documented migration instructions

AI is not allowed to reinterpret this role.

---

## Final Statement

**The UI shows what the system does.  
It never decides what the system is.**

This decision is foundational.
