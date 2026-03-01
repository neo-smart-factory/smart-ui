# UI Diagnostic Checklist

> **⚠️ ARCHIVED DOCUMENT**  
> This document is preserved for historical reference. The content reflects the state of the project at the time of archiving and may contain outdated nomenclature (e.g., "forge" instead of "deploy/smart"). Please refer to current documentation for up-to-date information.

**Data:** 2026-01-24  
**Status:** Ativo  
**Categoria:** Guia  
**Audiência:** Desenvolvedores

> **Mode:** Diagnostic only (no changes allowed)

---

## Smart UI — Read-Only Assessment

## 0. Diagnostic Mode Declaration

This assessment describes the state of the codebase as of January 2026.

---

## 1. Structural State

- [x] **Root folders listed**:

  - `/src` (Main React/Vite Dashboard Logic)
  - `/landing` (Landing Page Workspace)
  - `/nuxt-app` (Mobile App Workspace, Vue 3)
  - `/api` (Vercel Serverless Functions)
  - `/migrations` (Database Schema)
  - `/scripts` (DevOps & Deploy Scripts)
  - `/docs` (Documentation)

- [x] **Main entry points identified**:

  - Dashboard: `src/main.jsx` -> `src/App.jsx`
  - Landing: `landing/index.html` -> `landing/main.js`
  - Mobile: `nuxt-app/src/main.js` -> `nuxt-app/src/App.vue`
  - API: `api/deploys.js`, `api/drafts.js`

- [x] **Build and runtime structure described**:

  - **Dashboard**: Vite + React. Output: `dist/`.
  - **Landing**: Vite (HTML/JS). Output: `landing/dist/`.
  - **Mobile**: Vite + Vue 3. Output: `nuxt-app/dist/`.
  - **API**: Vercel Serverless Functions (Node.js runtime).

- [x] **Frameworks and tooling identified**:
  - **Core**: React 18, Vue 3.
  - **Build**: Vite 5/6/7.
  - **Styling**: TailwindCSS, PostCSS.
  - **Backend/DB**: Vercel Serverless, Neon (Postgres), `neondatabase/serverless` driver.
  - **Linting**: ESLint (Flat Config).

---

## 2. Existing Integrations

- [x] **External APIs called**:

  - `/api/deploys` (Internal)
  - `/api/drafts` (Internal)
  - `modal.run` (NΞØ Intelligence API - configured in env, used in Python script)

- [x] **Backend services referenced**:

  - **Database**: Neon Serverless Postgres (`DATABASE_URL`, `DIRECT_URL`).
  - **Cloud**: Vercel (Hosting & Functions).
  - **Monitoring**: Sentry (`NEXT_PUBLIC_SENTRY_DSN`).
  - **AI**: Modal (`MODAL_API_URL`).

- [x] **Wallet or blockchain interactions**:

  - `window.ethereum` (Injected providers / Metamask).
  - Hardcoded fallback demo wallet logic.
  - Deployment simulation (timeouts) currently present in `App.jsx`.

- [x] **Environment variables related to integration**:
  - `DATABASE_URL` / `DIRECT_URL` (Server-side only).
  - `MODAL_TOKEN_ID` / `SECRET` (Server-side/Scripts).
  - `NEXT_PUBLIC_SENTRY_DSN` (Client-side).
  - `VITE_DYNAMIC_ENVIRONMENT_ID` (Auth - prepared but logic possibly pending).

---

## 3. Responsibilities Assumed by the UI

- [x] **State derivation logic**:

  - UI manages form wizard state (`step`, `formData`).
  - History (`deployHistory`) is fetched from API but UI handles display formatting.

- [x] **Transaction construction**:

  - CURRENTLY SIMULATED. `handleForge` in `App.jsx` has a `setTimeout` simulation.
  - Real transaction construction logic is pending or routed to backend (not fully visible in current `App.jsx`).

- [x] **Validation or rule enforcement**:

  - `validateForge` function in `App.jsx` enforces:
    - Token Name length.
    - Symbol length.
    - Positive Supply.
    - Wallet connection presence.

- [x] **Assumptions about backend behavior**:
  - Assumes `/api/deploys` returns a list of objects compatible with the UI history component.
  - Assumes `/api/drafts` supports upsert logic implicit in the UI flow (save draft on step 2).

---

## 4. Boundary Violations (Factual)

- [x] **Calls backend logic directly**:

  - No. Database calls are correctly abstracted behind `api/` endpoints (Serverless Functions). The UI does NOT import `lib/db.js` directly anymore.

- [x] **Infers protocol state**:

  - Yes. UI infers "deployment success" based on the response from its own simulation or API, rather than on-chain event listening (at this specific snapshot).

- [x] **Constructs transactions**:

  - No (at this moment). It simulates them.

- [x] **Implements business rules**:

  - Yes. Token validation rules (min length, etc.) are in the UI code.

- [x] **Encodes lifecycle assumptions**:
  - Yes. Assumes a linear flow (Step 1 -> Step 2 -> Forge -> Success).

---

## 5. Operational Status

- [x] **Project builds successfully**:

  - **YES**. Dashboard, Landing, and Mobile modules build correctly via `make build-all` or `make deploy`.

- [x] **Runs locally**:

  - **YES**. `vercel dev` starts all services correctly.

- [x] **Known runtime errors**:

  - None detected in recent verify checks. Previous database connection errors resolved.

- [x] **TODOs or placeholders**:

  - `handleForge` contains simulation code (`setTimeout`).
  - `connectWallet` has a "Demo fallback" generating random addresses.
  - `OpsDashboard` component stub exists but integration depth varies.

- [x] **Incomplete flows**:
  - Actual Blockchain Transaction (Minting) is mocked.
  - `VITE_DYNAMIC_ENVIRONMENT_ID` exists in Env but Dynamic implementation not fully visible in `App.jsx` (uses generic `window.ethereum`).

---

## 6. Documentation Alignment (Deferred)

- [x] **Are there implicit contracts not documented?**:

  - The API schema for `/api/deploys` and `/api/drafts` is defined in code (`migrations/01_init.sql`) but explicitly documented only there.

- [x] **Are there assumptions without references?**:
  - The "5% protocol fee" mentioned in the UI is hardcoded text, logic implementation not visible in this slice.

---

## 7. Stop Condition

- [x] **Stop execution**: Assessment Complete.
- [x] **Do not implement changes**: No changes made during checking.
- [x] **Await human instruction**: Ready.

---
