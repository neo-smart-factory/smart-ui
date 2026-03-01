# ADR 0001 — Smart UI ↔ Backend Boundary

**Status:** Accepted  
**Date:** 2026-01-21  
**Versão:** 1.0.0  
**Deciders:** NΞØ Architecture  
**Applies to:** smart-ui, smart-core, smart-cli, internal-ops, landing

---

## Context

The NΞØ Smart Token Factory is composed of multiple repositories with clearly separated responsibilities.

As the system evolves, there is a high risk of:

- frontend-driven architectural decisions
- implicit API contracts
- UI logic leaking into protocol logic
- AI-assisted code introducing hidden coupling

This ADR establishes a **hard boundary** between the Smart UI and backend layers to preserve system integrity.

---

## Decision

The Smart UI is strictly a **presentation and intent layer**.

All backend interaction **must** be mediated by the Smart CLI.

Direct communication between Smart UI and Smart Core is **explicitly forbidden**.

---

## Boundaries Defined

### Smart UI

The Smart UI:

- renders state
- visualizes outputs
- triggers predefined intents

The Smart UI MUST NOT:

- deploy contracts
- construct transactions
- infer protocol state
- implement business rules
- call smart-core directly

---

### Smart CLI

The Smart CLI:

- is the sole gateway to smart-core
- validates intent
- enforces safety
- abstracts execution, not rules

The Smart CLI MAY:

- expose read-only status endpoints
- execute documented commands
- provide deterministic outputs for UI consumption

---

### Smart Core

The Smart Core:

- owns on-chain logic
- enforces protocol rules
- exposes no UI-oriented interfaces

Smart Core MUST NOT:

- adapt logic for UI convenience
- expose direct endpoints to UI
- contain presentation concerns

---

## Rationale

This boundary ensures:

- security invariants are preserved
- upgrades remain controlled
- UI changes do not force protocol changes
- AI agents cannot shortcut safety layers

Operational integrity is prioritized over UX convenience.

---

## Consequences

### Positive

- clear separation of concerns
- auditable interaction paths
- predictable upgrade flows
- safer AI-assisted development

### Negative

- increased integration discipline
- UI development requires coordination
- no direct shortcuts for rapid prototyping

These trade-offs are intentional.

---

## Enforcement

This ADR is enforced by:

- `integration-map.md`
- `workflow.md`
- CI boundary checks
- human review

Violations result in PR rejection.

---

## Alternatives Considered

### Direct UI → Core Integration

Rejected due to:

- security risks
- hidden coupling
- unbounded UX-driven logic

### Backend-for-Frontend (BFF)

Rejected due to:

- duplication of logic
- increased maintenance surface
- unclear ownership

---

## Notes for AI Assistants

AI agents must:

- treat this boundary as non-negotiable
- stop when an integration violates this ADR
- propose documentation changes before any exception

AI is not allowed to reinterpret this decision.

---

## Final Statement

**Interfaces do not define architecture.  
Architecture defines interfaces.**

This boundary is foundational.
