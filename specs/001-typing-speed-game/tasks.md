---
description: "Task list template for feature implementation"
---

# Tasks: Typing Speed Game

**Input**: Design documents from `/specs/001-typing-speed-game/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Included per TDD principle in constitution - unit tests for calculations, component tests for UI, integration tests for game flow.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions
- **Web app**: `src/` at repository root
- Paths follow the structure defined in plan.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create TypeScript type definitions in src/types/
- [x] T002 Set up LocalStorage utilities in src/utils/localStorage.ts
- [x] T003 Create text themes utility in src/utils/textThemes.ts
- [x] T004 Initialize React contexts in src/contexts/
- [x] T005 [P] Configure linting and formatting tools
- [x] T006 [P] Set up Jest and React Testing Library

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure required for all user stories

- [x] T007 Create base UI components in src/components/ui/
- [x] T008 Set up main app layout in src/app/layout.tsx
- [x] T009 Create theme context for dark/light mode in src/contexts/ThemeContext.tsx

## Phase 3: User Story 1 - Complete Timed Typing Challenge

**Goal**: Enable users to play a basic timed typing game with results display

**Independent Test**: User can select time limit, start game, type displayed text, game ends at time limit, shows WPM, accuracy, errors, retry option

**Tests**: Unit tests for WPM/accuracy calculations, integration test for complete game flow

- [x] T010 [US1] Create GameSession type in src/types/game.ts
- [x] T011 [US1] Implement WPM calculation utility in src/utils/calculations.ts
- [x] T012 [US1] Create useGame hook in src/hooks/useGame.ts
- [x] T013 [US1] Create Game component in src/components/game/Game.tsx
- [x] T014 [US1] Create TextDisplay component in src/components/game/TextDisplay.tsx
- [x] T015 [US1] Create MetricsBar component in src/components/game/MetricsBar.tsx
- [x] T016 [US1] Create ResultsModal component in src/components/game/ResultsModal.tsx
- [x] T017 [US1] Update main page to include game in src/app/page.tsx
- [x] T018 [US1] Add unit tests for calculations in src/tests/utils/calculations.test.ts
- [x] T019 [US1] Add component tests for Game in src/tests/components/Game.test.tsx
- [x] T020 [US1] Add integration test for game flow in src/tests/integration/gameFlow.test.tsx

## Phase 4: User Story 2 - Receive Real-Time Typing Feedback

**Goal**: Provide immediate visual feedback during typing

**Independent Test**: User sees correct characters in green, errors in red, current word highlighted, without completing game

**Tests**: Component tests for color changes

- [x] T021 [US2] Update TextDisplay to show color feedback in src/components/game/TextDisplay.tsx
- [x] T022 [US2] Implement character highlighting logic in src/hooks/useGame.ts
- [x] T023 [US2] Add component tests for TextDisplay in src/tests/components/TextDisplay.test.tsx

## Phase 5: User Story 3 - Track Performance Metrics in Real-Time

**Goal**: Display live WPM, accuracy, errors, time remaining

**Independent Test**: Metrics update as user types, without game completion

**Tests**: Hook tests for metric calculations

- [x] T024 [US3] Update MetricsBar to show real-time data in src/components/game/MetricsBar.tsx
- [x] T025 [US3] Enhance useGame with real-time calculations in src/hooks/useGame.ts
- [x] T026 [US3] Add hook tests for useGame in src/tests/hooks/useGame.test.ts

## Phase 6: User Story 4 - Select Difficulty and Theme

**Goal**: Allow users to choose difficulty levels and text themes

**Independent Test**: User can select options, game starts with appropriate text

**Tests**: Component tests for selection UI

- [x] T027 [US4] Create difficulty/theme selection component in src/components/ui/SelectionPanel.tsx
- [x] T028 [US4] Update text generation to use difficulty/theme in src/utils/textThemes.ts
- [x] T029 [US4] Integrate selection into Game component in src/app/page.tsx
- [x] T030 [US4] Add component tests for SelectionPanel in src/tests/components/SelectionPanel.test.tsx

## Phase 7: User Story 5 - View and Compete on Leaderboard

**Goal**: Display top scores with WPM and accuracy

**Independent Test**: After games, scores appear on leaderboard sorted by WPM

**Tests**: Hook tests for leaderboard logic

- [x] T031 [US5] Create LeaderboardEntry type in src/types/leaderboard.ts
- [x] T032 [US5] Implement useLeaderboard hook in src/hooks/useLeaderboard.ts
- [x] T033 [US5] Create Leaderboard component in src/components/leaderboard/Leaderboard.tsx
- [x] T034 [US5] Integrate leaderboard into main page in src/app/page.tsx
- [x] T035 [US5] Add leaderboard submission logic in src/hooks/useGame.ts
- [x] T036 [US5] Add hook tests for useLeaderboard in src/tests/hooks/useLeaderboard.test.ts

## Phase 8: User Story 6 - Practice in Focus Mode

**Goal**: Provide timer-free practice focused on accuracy

**Independent Test**: User can practice without time limit, tracks accuracy only

**Tests**: Component tests for mode switching

- [x] T037 [US6] Add Focus Mode option to SelectionPanel in src/components/ui/SelectionPanel.tsx
- [x] T038 [US6] Update useGame to support Focus Mode in src/hooks/useGame.ts
- [x] T039 [US6] Modify ResultsModal for Focus Mode in src/components/game/ResultsModal.tsx
- [x] T040 [US6] Add component tests for Focus Mode in src/tests/components/SelectionPanel.test.tsx

## Phase 9: User Story 7 - Unlock Power-Up Mode

**Goal**: Unlock slow-motion mode after perfect accuracy streak

**Independent Test**: After 3 perfect games, power-up available, slows time when activated

**Tests**: Hook tests for streak tracking and power-up

- [x] T041 [US7] Add consecutive perfect tracking in src/hooks/useGame.ts
- [x] T042 [US7] Implement power-up activation logic in src/hooks/useGame.ts
- [x] T043 [US7] Add power-up UI indicator in src/components/game/Game.tsx
- [x] T044 [US7] Add hook tests for power-up in src/tests/hooks/useGame.test.ts

## Final Phase: Polish & Cross-Cutting Concerns

**Purpose**: Final enhancements and quality improvements

- [x] T045 Add animations with Framer Motion in src/components/game/
- [x] T046 Implement accessibility features (ARIA labels, keyboard nav) in src/components/
- [x] T047 Add mobile-responsive styling with Tailwind in src/components/
- [x] T048 Optimize performance (memoization, virtualization) in src/components/
- [x] T049 Add error handling and edge cases in src/hooks/
- [x] T050 Update README with setup instructions

## Dependencies

**User Story Completion Order**:
- US1 (P1) - Foundation for all other stories
- US2, US3 (P1) - Can run in parallel with US1
- US4, US5 (P2) - Depend on US1 completion
- US6, US7 (P3) - Depend on US4/US5 completion

**Blocking Dependencies**:
- All stories depend on Phase 1 & 2 completion
- US5 depends on LeaderboardEntry type from US1
- US7 depends on User Stats tracking from US1

## Parallel Execution Examples

**Per User Story**:
- US1: T010-T020 can run sequentially or parallel where marked
- US2: T021-T023 (depends on US1 TextDisplay)
- US3: T024-T026 (depends on US1 MetricsBar)
- US4: T027-T030 (parallel with US5)
- US5: T031-T036 (parallel with US4)
- US6: T037-T040 (depends on US4)
- US7: T041-T044 (depends on US1)

**Cross-Story Parallelism**:
- Types (T010, T031) can be parallel
- UI components can be parallel if no shared state
- Tests can run in parallel with implementation

## Implementation Strategy

**MVP Scope**: User Story 1 (Complete Timed Typing Challenge) - provides core value

**Incremental Delivery**:
1. US1: Basic timed game
2. US2 + US3: Enhanced feedback and metrics
3. US4: Customization options
4. US5: Competition element
5. US6 + US7: Advanced practice modes

**Quality Gates**:
- All tests pass before story completion
- Manual testing of independent test criteria
- Constitution compliance check
- Performance meets targets (60fps, <2s load)