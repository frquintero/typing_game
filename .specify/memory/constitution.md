<!--
SYNC IMPACT REPORT
Version: 1.0.0 (Initial Creation)
Ratified: 2025-10-16

New Principles Added (10 total):
- I. Client-Side First (LocalStorage-Based Architecture)
- II. Type-Safe, Spec-First TypeScript
- III. Modular Component Architecture (React Context + Hooks)
- IV. Real-Time Metrics & Performance Gates
- V. Accessibility & Inclusive Design (WCAG AA Compliant)
- VI. Test-Driven Development with Metrics
- VII. Animations & Visual Feedback (Framer Motion)
- VIII. Mobile-Responsive Design (Mobile-First, Tailwind CSS)
- IX. Modular Word Lists & Theme System
- X. LocalStorage Data Management Strategy

New Sections:
- Architecture & Technology Constraints
- Development Workflow & Collaboration
- Governance (amended)

Templates Updated:
✅ plan.md - Aligned with LocalStorage strategy, 8-sprint roadmap
✅ spec-template.md - No changes required (generic template still valid)
✅ tasks-template.md - No changes required (generic template still valid)
✅ plan-template.md - Add "Constitution Check" gate references

Follow-up Actions:
- Generate spec.md from project requirements
- Generate tasks.md from sprints in plan.md
- Create README.md with setup instructions
-->

# Typing Game Constitution

## Core Principles

### I. Client-Side First (LocalStorage-Based Architecture)

All data persists to browser LocalStorage; no backend database required for MVP. MUST NOT introduce external service dependencies (Supabase, Firebase, API servers) without explicit justification and constitution amendment. Data storage strategy: single `typingGame` namespace with structured keys (`userStats`, `leaderboard`, `theme`, `gameHistory`). Leaderboard limited to 1000 entries (~5-10MB per domain). Export/import functionality REQUIRED for data portability.

**Rationale**: Simplifies deployment (static hosting only), eliminates backend complexity, reduces latency, enables offline operation within session. Scalability trade-off accepted: if user base exceeds LocalStorage limits, architecture must be amended and backend introduced deliberately.

### II. Type-Safe, Spec-First TypeScript

All source code written in TypeScript with strict mode enabled. Type definitions precede implementation. Interfaces defined in `src/types/` for Game, Leaderboard, and User entities before hooks or components. No `any` types permitted except in narrow vendor integration cases (justified in comments). Types must be exported from central locations and reused across layers.

**Rationale**: Prevents runtime errors, enables early API contracts, improves IDE support and refactoring safety. Spec-first approach ensures contracts are frozen before implementation.

### III. Modular Component Architecture (React Context + Hooks)

Components organized by feature domain: Game, UI, Leaderboard with single responsibility. Shared state managed via React Context (GameContext, ThemeContext) and custom hooks (useGame, useTimer, useTypeDetection, useLeaderboard). Each hook MUST have one primary concern. Context providers wrapped at appropriate hierarchy levels. Props drilled minimally; composition over prop drilling.

**Rationale**: Enables independent testing of game logic (hooks) from UI rendering. Reduces re-render overhead. Simplifies state debugging.

### IV. Real-Time Metrics & Performance Gates

Game loop updates every 100ms (not every frame). Metrics (WPM, accuracy, error count) calculated incrementally as user types. Components memoized with React.memo and useCallback to prevent unnecessary re-renders. Leaderboard virtualized (render only visible rows) when list exceeds 50 entries. Target: 60fps gameplay with smooth animations on mid-range mobile devices.

**Rationale**: Ensures smooth gameplay experience even on slower hardware. Prevents janky UI and laggy input response.

### V. Accessibility & Inclusive Design (WCAG AA Compliant)

All interactive elements MUST support keyboard navigation. ARIA labels required for game metrics (WPM, accuracy, timer). Color contrast ratios meet WCAG AA minimum (4.5:1 for body text). Focus indicators visible at all times. Results modal MUST be announced to screen readers. No color-only differentiation; use icons + text. Mobile buttons minimum 44px × 44px touch target.

**Rationale**: Ensures usability for all users including those with disabilities. Keyboard-first approach benefits power users and automation.

### VI. Test-Driven Development with Metrics

Unit tests required for: WPM/accuracy calculations, character validation, word generation, LocalStorage persistence. Component tests for TextDisplay coloring, MetricsBar updates. Integration tests for complete game flow (start → play → end). Target: 80%+ coverage of calculation and business logic. Tests MUST pass before code review approval.

**Rationale**: Calculations are non-negotiable (user-facing metrics must be correct). Integration tests catch flow regressions early.

### VII. Animations & Visual Feedback (Framer Motion)

Animations use Framer Motion for consistency. Transitions between game states (idle → starting → playing → finished) include smooth animations. Character highlighting (green/red/blue/gray) animated with 100ms easing. Power-up unlock includes particle animation; slow-motion indicated by visual pulse. All animations < 500ms to avoid UX friction.

**Rationale**: Polished UX builds user confidence. Consistent animation library prevents code duplication.

### VIII. Mobile-Responsive Design (Mobile-First, Tailwind CSS)

Design mobile-first in Tailwind; scale up to desktop. Hidden input field for keyboard capture (accessibility). No hover-only interactions (mobile has no hover). Responsive breakpoints: mobile (default), tablet (768px), desktop (1024px). Test on actual mobile devices (iOS Safari, Android Chrome) before deployment.

**Rationale**: 40%+ users expected on mobile. Ensures feature parity across devices.

### IX. Modular Word Lists & Theme System

Word lists organized by difficulty (Easy, Medium, Hard) and theme (Normal, Programming, Motivational, Fitness). Themes defined in `src/utils/textThemes.ts` with word arrays. Word generation produces random text combining theme words with difficulty level. Support for adding custom word lists (future feature) without modifying core game logic.

**Rationale**: Enables rapid A/B testing of themes. Decouples word content from game mechanics. Facilitates future crowdsourced word lists.

### X. LocalStorage Data Management Strategy

Data structured with single `typingGame` namespace:
- `typingGame:userStats` — aggregated stats and power-up status
- `typingGame:leaderboard` — all game rounds (sorted by WPM)
- `typingGame:theme` — dark/light mode preference
- `typingGame:gameHistory` — detailed history of recent games

Sync state to LocalStorage on every stat update. Load from LocalStorage on app startup. Auto-cleanup: leaderboard pruned to 1000 most recent entries. Export/import as JSON for user backup. Clearing browser data resets stats (expected behavior, documented).

**Rationale**: Single namespace prevents conflicts. Structured keys enable independent mutation. Pruning prevents quota exhaustion.

## Architecture & Technology Constraints

**Frontend Stack**: Next.js 14+ (App Router), React 18+, TypeScript (strict mode), Tailwind CSS, Framer Motion.

**Storage**: LocalStorage only (no backend services, no databases).

**Deployment**: Vercel (optimal for Next.js). Can deploy to any static host. No environment variables required for core functionality.

**Browser Compatibility**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+. ES2020+ syntax permitted.

**Performance Targets**:
- Initial load < 2 seconds
- Game area renders without lag at 60fps
- Metrics update every 100ms
- Mobile smooth on 2019+ devices

**Quality Standards**:
- TypeScript strict mode enabled
- No console errors in production
- Linting with ESLint (Airbnb or Standard config)
- Formatting with Prettier (2-space indent)

## Development Workflow & Collaboration

**Branching**: Feature branches named `[###-feature-name]` (e.g., `001-core-gameplay`). Main branch always deployable.

**Code Review**: All PRs reviewed before merge. Verification checklist: Constitution compliance, test coverage, no type errors, WCAG accessibility check (color contrast, keyboard nav, ARIA labels).

**Testing Gate**: Tests MUST pass locally before PR creation. Integration tests run on CI/CD. Coverage reports generated on each PR.

**Documentation**: Each component MUST have JSDoc comment with props, example usage. Hooks documented with parameter/return types. Services documented with input/output contracts.

**Commit Messages**: Conventional commits: `feat:`, `fix:`, `docs:`, `chore:`, `test:`, `refactor:`. Example: `feat: implement slow-motion power-up activation`.

## Governance

Constitution supersedes all development practices. Amendments require:
1. Justification document explaining rationale
2. Migration plan if breaking existing code
3. Version bump and date update (see versioning below)

All code reviews MUST verify compliance against Core Principles. Violations MUST be justified via complexity tickets and tracked separately.

**Versioning Policy**: MAJOR.MINOR.PATCH
- **MAJOR**: Principle removal or redefinition (breaking governance changes)
- **MINOR**: New principle added or architecture guidance expanded
- **PATCH**: Clarifications, wording, typo fixes (non-semantic changes)

If unclear, propose version bump reasoning to project maintainers before finalizing.

**Runtime Development Guidance**: See `plan.md` for technical roadmap. Refer to `.specify/` directory for spec templates and task definitions.

**Version**: 1.0.0 | **Ratified**: 2025-10-16 | **Last Amended**: 2025-10-16
