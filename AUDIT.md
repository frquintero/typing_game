Typing Game Codebase Audit and Improvement Plan

Date: 2025-10-18
Branch: audit-typing-game-priority-plan-quick-wins

1) Architecture Review

- Tech stack: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Framer Motion. App-level layout is an RSC and the main page is a Client Component.
- Routing and RSC vs client components:
  - src/app/layout.tsx is a Server Component (default) and wraps children with a Client ErrorBoundary. This is valid in Next.js.
  - src/app/page.tsx is marked 'use client' and lazily loads main views (Game, SelectionPanel, Leaderboard). This keeps SSR predictable and pushes most interactivity to the client.
  - Game and all UI/widgets are Client Components as expected.
- Component boundaries:
  - ErrorBoundary is a single global boundary in layout. Consider additional route-level or feature-level boundaries to isolate failures.
  - Views are split logically: Selection panel, gameplay, leaderboard.
- Types and domains:
  - Domain types for game and leaderboard exist under src/types. There is some duplication between src/types/game.ts and src/types/leaderboard.ts (LeaderboardEntry is defined in both with slightly different shapes). This can lead to drift.

2) Performance and Bundle Size

- Positive:
  - Heavy views/components (Game, Leaderboard, SelectionPanel) are lazy loaded via React.lazy and Suspense, reducing initial bundle.
  - Framer Motion is used with small animated sections; effects are localized, not global.
- Risks / Opportunities:
  - page.tsx is a Client Component, so the entire page is client-hydrated. If SEO or TTFB becomes critical, consider an RSC wrapper or moving non-interactive parts to RSCs.
  - framer-motion can add to bundle; ensure tree-shaking is effective and variants are simple.
  - Text generation is lightweight but runs on startGame; safe.
  - Avoid unnecessary re-renders from broad state in useGame by splitting state if perf becomes a concern; currently OK for scale.

3) Accessibility

- Positive:
  - Uses semantic roles, aria-live, aria-labels, hidden headings, and keyboard handling.
  - Labels and inputs are correctly associated via htmlFor/id.
- Issues found and quick-fixed:
  - Duplicate ID 'metrics-heading' rendered in both Game and MetricsBar. This can confuse screen readers and violates uniqueness. Fixed by removing inner heading in MetricsBar and using aria-label instead; Game now generates a unique heading id via useId and labels the region.
- Opportunities:
  - Results modal uses a global click/keydown listener to close; consider focus trapping, Esc to close, and preventing interaction with background content for stricter dialog semantics.
  - Ensure proper initial focus when the modal opens (e.g., move focus to modal container).

4) State and Hooks Design

- useGame encapsulates the entire game loop: timing, metrics, slow-mo power-up, completion. Clear separation and memoization for currentWordIndex.
- useLeaderboard centralizes localStorage usage, validation, sorting, and cross-tab sync via a CustomEvent + storage event.
- Edge cases handled:
  - localStorage guarded via typeof window checks.
  - Robust parsing of stored entries with validation of timestamp shapes.
- Improvements made:
  - addEntry dependency array removed from [entries] to [] to avoid unnecessary re-creations and potential effects churn.
  - Keydown handler in Game no longer preventsDefault for all keys during gameplay; it now only prevents default for characters and Backspace, avoiding unintended blocking of browser shortcuts.
- Opportunities:
  - Consider extracting keyboard handling to a dedicated hook (useTypingInput) with tests.
  - Consider using useReducer for game state transitions to make flows explicit and testable.

5) Testing Coverage

- Jest + Testing Library present with component, hooks, and integration tests in src/tests.
- Tests verify core rendering and basic interactions.
- Opportunities:
  - Add tests for useLeaderboard validation behavior with malformed localStorage payloads.
  - Add tests for power-up timing and focus mode completion conditions.
  - Add a11y regression tests (e.g., @testing-library/jest-dom axe integration if desired).

6) DX and CI

- DX:
  - TypeScript configured and already had strict enabled.
  - ESLint with next/core-web-vitals; Prettier present.
- Improvements made:
  - Stricter TypeScript flags added: noUncheckedIndexedAccess, exactOptionalPropertyTypes, noImplicitReturns, noFallthroughCasesInSwitch, forceConsistentCasingInFileNames, useUnknownInCatchVariables. This improves type safety and reliability.
  - ESLint rules expanded for quick wins: no-console (warn), no-duplicate-imports (error), no-unused-vars (warn), react/jsx-no-duplicate-props (error), react-hooks/exhaustive-deps (error), jsx-a11y rule tweaks. No new plugins required.
- CI:
  - GitHub Actions folder exists; not modified. Ensure pipelines run lint, typecheck, tests.

7) Reliability and Error Handling

- ErrorBoundary is present at app layout level and logs errors to console. Consider wiring to real telemetry (Sentry) in production.
- useGame catches and surfaces errors for text generation and key handling; cleared via clearError.
- localStorage operations are guarded and can throw on write when requested (throwOnError). Event-based synchronization is robust across tabs.

2) Prioritized Backlog of Actionable Fixes

P0 – Quick wins (implemented in this PR)
- Fix duplicate IDs in metrics region
  - AC: No duplicate id attributes in rendered markup; aXe/lighthouse does not report duplicate-id violations for metrics section.
- Harden TypeScript configuration
  - AC: tsconfig includes noUncheckedIndexedAccess, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, noImplicitReturns, noFallthroughCasesInSwitch, useUnknownInCatchVariables; project still builds and typechecks.
- Improve ESLint rules
  - AC: .eslintrc extends next/core-web-vitals and includes rules to warn on console usage (except warn/error), flag duplicate imports and duplicate props, enforce exhaustive-deps, and flag unused vars; lint passes or yields actionable warnings.
- Prevent intrusive keyboard event blocking
  - AC: During gameplay, only character input and Backspace are prevented from default; browser shortcuts continue to work.

P1 – Accessibility and UX
- Modal dialog semantics and focus management
  - AC: Results modal traps focus, restores focus to trigger on close, supports Esc to close, and has aria-labelledby pointing at its own visible title; background inert behavior added.
- Keyboard-only gameplay and settings
  - AC: Users can start/retry/quit using keyboard only; buttons have clear focus styles.

P1 – Types and Domain Consistency
- Unify Leaderboard types
  - AC: Single source of truth for LeaderboardEntry; remove duplicate interfaces across src/types.

P2 – Performance and Architecture
- RSC boundary optimization
  - AC: Non-interactive sections render as Server Components; client footprint reduced on first load by at least 10% (bundle analyze baseline vs optimized).
- Split useGame into reducers/modules
  - AC: useReducer with explicit actions for timing, input, power-up; individual unit tests for reducer logic.

P2 – Testing Enhancements
- Add robustness tests
  - AC: Tests for malformed localStorage data, storage events, power-up timing, and focus mode completion; coverage threshold: statements/branches > 85% for hooks.

P3 – Observability
- Error and performance monitoring
  - AC: Add Sentry or similar with environment gating; report caught errors in ErrorBoundary with user-agent/context.

3) Summary of Quick Wins Implemented in this PR

- Accessibility: Removed duplicate heading id from MetricsBar and made the metrics region in Game use a unique id via useId. MetricsBar now uses aria-label instead of aria-labelledby.
- Input handling: Game no longer prevents default for all keys during gameplay; only characters and Backspace are handled.
- TypeScript: Strengthened tsconfig with additional strict flags for safer code.
- ESLint: Added helpful rules for common pitfalls without introducing new plugins.
- Leaderboard hook: Cleaned addEntry dependency array to avoid unnecessary re-creation and potential effect churn.

Notes

- No CI/workflow files were modified per guidelines.
- No behavior changes expected except improved accessibility and input handling.
- All changes conform to existing style and patterns in the codebase.
