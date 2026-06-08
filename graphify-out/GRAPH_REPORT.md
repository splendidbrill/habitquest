# Graph Report - src  (2026-06-01)

## Corpus Check
- 128 files · ~111,940 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 377 nodes · 322 edges · 18 communities detected
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 29 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Push Notifications & Streak Engine|Push Notifications & Streak Engine]]
- [[_COMMUNITY_Family Adventure Mode|Family Adventure Mode]]
- [[_COMMUNITY_Auth & Parent Onboarding|Auth & Parent Onboarding]]
- [[_COMMUNITY_Family Challenges & XP|Family Challenges & XP]]
- [[_COMMUNITY_Pillar Score Engine|Pillar Score Engine]]
- [[_COMMUNITY_Mystery Box & Variable Rewards|Mystery Box & Variable Rewards]]
- [[_COMMUNITY_Kids 8-10 Skill Drills Game|Kids 8-10 Skill Drills Game]]
- [[_COMMUNITY_Mystery Box & Variable Rewards|Mystery Box & Variable Rewards]]
- [[_COMMUNITY_Rule-Based Recommendations|Rule-Based Recommendations]]
- [[_COMMUNITY_AI Agent (DeepSeek + GPT-4.1)|AI Agent (DeepSeek + GPT-4.1)]]
- [[_COMMUNITY_Parent Emoji Reactions|Parent Emoji Reactions]]
- [[_COMMUNITY_Child Context & Sync Hook|Child Context & Sync Hook]]
- [[_COMMUNITY_Parent Barrier Solver|Parent Barrier Solver]]
- [[_COMMUNITY_Kids Superhero Workout|Kids Superhero Workout]]
- [[_COMMUNITY_Kids 10-12 Screens|Kids 10-12 Screens]]
- [[_COMMUNITY_Theme & Styles|Theme & Styles]]
- [[_COMMUNITY_Text-to-Speech|Text-to-Speech]]
- [[_COMMUNITY_Kids 8-10 Screens|Kids 8-10 Screens]]

## God Nodes (most connected - your core abstractions)
1. `calculatePillarScores()` - 9 edges
2. `syncMissionComplete()` - 8 edges
3. `useAuth()` - 6 edges
4. `getRecommendedMissions()` - 6 edges
5. `handleContribute()` - 4 edges
6. `startDrill()` - 4 edges
7. `buildContext()` - 4 edges
8. `getAIRecommendations()` - 4 edges
9. `getParentDigest()` - 4 edges
10. `getWeekStart()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `useParentData()` --calls--> `useAuth()`  [INFERRED]
  C:\Code\habitquest\src\hooks\useParentData.ts → C:\Code\habitquest\src\context\AuthContext.tsx
- `AddChild()` --calls--> `useAuth()`  [INFERRED]
  C:\Code\habitquest\src\screens\AddChild.tsx → C:\Code\habitquest\src\context\AuthContext.tsx
- `FamilyCode()` --calls--> `useAuth()`  [INFERRED]
  C:\Code\habitquest\src\screens\FamilyCode.tsx → C:\Code\habitquest\src\context\AuthContext.tsx
- `SignIn()` --calls--> `useAuth()`  [INFERRED]
  C:\Code\habitquest\src\screens\auth\SignIn.tsx → C:\Code\habitquest\src\context\AuthContext.tsx
- `SignUp()` --calls--> `useAuth()`  [INFERRED]
  C:\Code\habitquest\src\screens\auth\SignUp.tsx → C:\Code\habitquest\src\context\AuthContext.tsx

## Communities

### Community 0 - "Push Notifications & Streak Engine"
Cohesion: 0.09
Nodes (13): cancelDailyNotifications(), cancelStreakAtRiskWarning(), notifyParentMissionComplete(), scheduleDailyNotifications(), scheduleStreakAtRiskWarning(), showStreakMilestoneNotification(), triggerAtHour(), checkAndGrantWeeklyFreeze() (+5 more)

### Community 1 - "Family Adventure Mode"
Cohesion: 0.14
Nodes (9): handleContribute(), handleStart(), contributeToStage(), getActiveAdventure(), getChildParentId(), startAdventure(), tryAdvanceStage(), async() (+1 more)

### Community 2 - "Auth & Parent Onboarding"
Cohesion: 0.14
Nodes (6): AddChild(), useAuth(), FamilyCode(), SignIn(), SignUp(), useParentData()

### Community 3 - "Family Challenges & XP"
Cohesion: 0.2
Nodes (10): addFamilyXP(), archiveChallenge(), childCompleteChallenge(), createChallenge(), loadChallengesForChild(), loadFamilyChallenges(), parentSupportChallenge(), handleArchive() (+2 more)

### Community 4 - "Pillar Score Engine"
Cohesion: 0.28
Nodes (10): blend(), calcConfidenceScore(), calcMovementScore(), calcNutritionScore(), calcSleepScore(), calculatePillarScores(), getWeekStart(), hasCompletedCheckInThisWeek() (+2 more)

### Community 5 - "Mystery Box & Variable Rewards"
Cohesion: 0.24
Nodes (5): openBox(), applyDailySpinReward(), applyMysteryReward(), applyXPCliff(), rollMysteryReward()

### Community 6 - "Kids 8-10 Skill Drills Game"
Cohesion: 0.29
Nodes (5): hitTarget(), scheduleTarget(), spawnTargets(), startBalance(), startDrill()

### Community 7 - "Mystery Box & Variable Rewards"
Cohesion: 0.22
Nodes (3): handleUpload(), runLotteryDraw(), uploadMealPhoto()

### Community 8 - "Rule-Based Recommendations"
Cohesion: 0.36
Nodes (9): getAvoidedTags(), getFocusPillar(), getFoodRecommendations(), getLikedFoods(), getLikedTags(), getRecentlyCompletedIds(), getRecommendedMissions(), getSkippedFoods() (+1 more)

### Community 10 - "AI Agent (DeepSeek + GPT-4.1)"
Cohesion: 0.57
Nodes (6): buildContext(), callProxy(), getAIRecommendations(), getParentDigest(), parseJSON(), getCurrentFocusPillar()

### Community 11 - "Parent Emoji Reactions"
Cohesion: 0.29
Nodes (2): handleDismiss(), markReactionsSeen()

### Community 12 - "Child Context & Sync Hook"
Cohesion: 0.4
Nodes (2): useChild(), useSync()

### Community 13 - "Parent Barrier Solver"
Cohesion: 0.4
Nodes (2): handleSelectBarrier(), resolveBarrier()

### Community 14 - "Kids Superhero Workout"
Cohesion: 0.5
Nodes (2): startCountdown(), startGame()

### Community 15 - "Kids 10-12 Screens"
Cohesion: 0.5
Nodes (2): finishWorkout(), skipExercise()

### Community 18 - "Theme & Styles"
Cohesion: 0.5
Nodes (2): withOpacity(), Welcome()

### Community 31 - "Text-to-Speech"
Cohesion: 0.83
Nodes (3): init(), speak(), stop()

### Community 47 - "Kids 8-10 Screens"
Cohesion: 1.0
Nodes (2): calculateRating(), isBalanced()

## Knowledge Gaps
- **Thin community `Parent Emoji Reactions`** (7 nodes): `ParentReactionBanner.tsx`, `handleDismiss()`, `getReactionTargets()`, `getUnseenReactions()`, `markReactionsSeen()`, `sendReaction()`, `reactionService.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Child Context & Sync Hook`** (5 nodes): `ChildProvider()`, `useChild()`, `ChildContext.tsx`, `useSync.ts`, `useSync()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Parent Barrier Solver`** (5 nodes): `handleReset()`, `handleSelectBarrier()`, `resolveBarrier()`, `barrierSolverData.ts`, `BarrierSolver.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Kids Superhero Workout`** (5 nodes): `saveCompletion()`, `startCountdown()`, `startGame()`, `startMove()`, `KidsSuperheroWorkout.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Kids 10-12 Screens`** (5 nodes): `finishWorkout()`, `resetWorkout()`, `skipExercise()`, `startWorkout()`, `Kids12MicroWorkouts.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Theme & Styles`** (4 nodes): `Welcome.tsx`, `theme.ts`, `withOpacity()`, `Welcome()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Kids 8-10 Screens`** (3 nodes): `calculateRating()`, `isBalanced()`, `Kids8LunchBuilder.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getCurrentFocusPillar()` connect `AI Agent (DeepSeek + GPT-4.1)` to `Rule-Based Recommendations`, `Pillar Score Engine`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **Why does `handleComplete()` connect `Family Adventure Mode` to `Family Challenges & XP`?**
  _High betweenness centrality (0.003) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `syncMissionComplete()` (e.g. with `checkAndGrantWeeklyFreeze()` and `checkStreakMilestone()`) actually correct?**
  _`syncMissionComplete()` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `useAuth()` (e.g. with `useParentData()` and `AddChild()`) actually correct?**
  _`useAuth()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `handleContribute()` (e.g. with `contributeToStage()` and `getActiveAdventure()`) actually correct?**
  _`handleContribute()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Should `Push Notifications & Streak Engine` be split into smaller, more focused modules?**
  _Cohesion score 0.09 - nodes in this community are weakly interconnected._
- **Should `Family Adventure Mode` be split into smaller, more focused modules?**
  _Cohesion score 0.14 - nodes in this community are weakly interconnected._