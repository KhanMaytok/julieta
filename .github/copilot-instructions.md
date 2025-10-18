# Copilot Instructions for julieta

## Project Overview
- **Framework:** Vue 3 + TypeScript + Vite
- **Structure:** Modular, with feature folders under `src/app/modules/`
- **UI Components:** Shared components in `src/assets/shared/components/ui/`
- **Routing:** Managed in `src/app/router/index.ts`
- **State/Logic:** Composables in `src/app/modules/*/composables/`
- **Models/Types:** Defined in `src/app/modules/*/models/`

## Key Patterns & Conventions
- **Vue SFCs:** Use `<script setup>` syntax for all new components.
- **TypeScript:** Strict typing enforced; always define types in `models/`.
- **Composables:** Place reusable logic in `composables/` and import as needed.
- **Component Registration:** UI components are grouped by type (e.g., `button/`, `card/`) and exported via `index.ts`.
- **Layouts:** Use `src/assets/shared/layouts/` for page-level layouts.
- **API Integration:** Axios config in `src/assets/shared/config/axios.ts`.
- **Error Handling:** Use `useApiErrorHandler` from `src/assets/shared/utils/`.

## Developer Workflows
- **Build:** `pnpm build` (uses Vite)
- **Dev Server:** `pnpm dev`
- **Type Check:** `pnpm typecheck` (if configured)
- **Lint:** `pnpm lint`
- **Test:** No test setup detected; add instructions if tests are introduced.

## Integration Points
- **External APIs:** Centralized in Axios config; composables handle API calls.
- **Cross-Module Communication:** Use composables and shared types for data flow.
- **Theme/Styles:** Global styles in `src/app/styles/`.

## Examples
- **Add a new feature module:**
  - Create folder in `src/app/modules/`
  - Add `composables/`, `models/`, `views/` as needed
- **Create a new UI component:**
  - Place in `src/assets/shared/components/ui/[type]/`
  - Export in `index.ts` for that type
- **Add a new route:**
  - Update `src/app/router/index.ts`

## References
- [Vue 3 `<script setup>`](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup)
- [TypeScript in Vue](https://vuejs.org/guide/typescript/overview.html)

---
_If any conventions or workflows are unclear or missing, please provide feedback to improve these instructions._
