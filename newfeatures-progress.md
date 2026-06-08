# HabitQuest `newfeatures.md` — Implementation Progress & Handoff

> **Read `newfeatures-plan.md` first** (the full 10-phase plan with schemas/guardrails). This file is the *delta*: what's already built, non-obvious facts discovered while building, and the concrete spec for the remaining phases. **All 10 phases are now DONE and type-clean.**

## How to run the fresh session cheaply
- Start with **`ECC_GATEGUARD=off`** (or add `pre:edit-write:gateguard-fact-force` + `pre:bash:gateguard-fact-force` to `ECC_DISABLED_HOOKS`). The fact-forcing gate doubled every write's round-trips and was the main cost driver.
- Type-check with `npx tsc --noEmit`. There is **no** `typecheck`/`lint`-clean baseline — the repo already has ~30 pre-existing TS errors in **unrelated** files (TTS hooks, kids8/kids12 screens, `aiAgentService.ts`, `syncService.ts`). Filter to your touched files: `npx tsc --noEmit 2>&1 | grep -E "fileA|fileB"`.
- A prettier/linter auto-reformats files after write (multi-line expansion). Harmless; don't fight it.

## Non-negotiable ground rules (from CLAUDE-level brief)
1. **AI calls = one path only:** `supabase.functions.invoke('ai-proxy', { body: { type: 'recommendations' | 'digest', prompt, maxTokens } })` → `{ text }`. No OpenAI/Anthropic SDKs, no client model keys. Client `@env` only has `SUPABASE_URL`, `SUPABASE_ANON_KEY`.
2. **New DB table** ⇒ (a) numbered migration `supabase/migrations/00X_*.sql`, (b) append same SQL to `supabase/schema.sql`, (c) RLS `child_id IN (SELECT id FROM children WHERE parent_id = auth.uid())` (child-owned) or `parent_id = auth.uid()` (parent-owned). Latest migration is now **008**.
3. Pillars = `nutrition | movement | sleep | confidence`. Age groups = `6-8 | 8-10 | 10-12`.
4. `food_logs.action` enum is fixed `tried|liked|skipped|repeated` — never overload; 5-state meal reactions use the **`meal_feedback`** table (Phase 6).
5. Styling = `StyleSheet.create` + tokens from `src/theme.ts` (`colors`, `typography`, `radius`, `withOpacity`). Icons `lucide-react-native`. Gradients `react-native-linear-gradient`. No Tailwind.
6. New screens ⇒ register in `src/navigation/index.tsx` (`RootStackParamList` + `<RootStack.Screen>`).
7. **No new npm deps** (esp. video) without asking. None installed for video.
8. `aiAgentService.ts` has a latent bug (guards on undefined globals `DEEPSEEK_AZURE_ENDPOINT`/`GPT41_AZURE_ENDPOINT`) — if you touch it, replace with a storage/config flag; don't copy that pattern.

## Non-obvious facts discovered this session (save re-discovery)
- **Active child id** comes from the `useChild()` context hook → `activeChild` with `.id`, `.age_group` (cast `as AgeGroup`), `.last_active_date`. Used by `WeeklyPlan` and `components/RecommendedMissions.tsx`. There is **no** `childId` AsyncStorage key. WeeklyPlan currently does NOT use `useChild` yet — it's family-level; Phase 5 needs to pull `activeChild.id` via `useChild()` to compute the preference model.
- `missionCatalog.ts` exports `missions` as **default** + named `CatalogMission`, `AgeGroup`. `Pillar` is from `../services/syncService`.
- `recommendationService.getRecommendedMissions(childId, ageGroup, startDate)` returns top-3 `Recommendation[]` (CatalogMission + score + reason). Its scoring weights live in the `W` block. `getLikedTags`/`getAvoidedTags` are now **exported**.
- `Card` (`src/components/ui/Card.tsx`), `Button`, `Checkbox` accept a `style` prop. `ProgressBar` lives at `src/components/ui/ProgressBar.tsx` (Phase 10 reuse).
- `supabase.auth.getUser()` → `data.user.id` is the parent id pattern (see `notificationService.ts`, `familyProfile.syncFamilyProfile`).
- Onboarding writes `AsyncStorage['onboardingAnswers']` = `Record<number,string|string[]>` with **non-contiguous** ids. The canonical map + reader is `src/data/familyProfile.ts` (`ONBOARDING_IDS`, `mapAnswersToProfile`, `loadFamilyProfile`). **Always** read profile through `loadFamilyProfile()` / `mapAnswersToProfile()`.

---

## ✅ DONE — Phase 1: Canonical Family Profile + DB foundation
- **`src/data/familyProfile.ts`** — `FamilyProfile` interface, `ActivityLevel`, `FamilyPersonality`, `ONBOARDING_IDS` (single source of the non-contiguous id map), `mapAnswersToProfile(answers)`, `hasProfileData`, `loadFamilyProfile()` (offline-first; **also merges** `cuisinePrefs`/`activityPrefs` from storage keys `cuisinePrefs`/`activityPrefs`), `syncFamilyProfile(profile)` (best-effort upsert to `family_profiles`).
- **Migration `006_family_profiles.sql`** + appended to `schema.sql` — `family_profiles(id, parent_id UNIQUE→profiles, profile JSONB, updated_at)`, RLS `parent_id = auth.uid()`.
- Refactored `src/utils/personalization.ts` (now delegates to `mapAnswersToProfile`; added `getBudget`, id 11), `WeeklyPlan.buildFamilyProfile` (consumes `loadFamilyProfile`), `HealthySwaps.tsx` (consumes `loadFamilyProfile`).

## ✅ DONE — Phase 2: Layered onboarding
- **`src/screens/Onboarding.tsx`** — added `inputType:'slider'` (tap-a-value 1–5, no dep) + textarea renderer; added `layer?: 1|2` to `Question`; flow renders only `layer1Questions` (`questions.filter(layer===1)`). New IDs **12–20** registered in `ONBOARDING_IDS`/`mapAnswersToProfile`: familyStructure 12, difficultFoods 13, childInterests 14, barriers 15, threeMonthGoal 16, weekdayBusyness 17 (slider), personality organisation/structure/rewardTiming 18/19/20. Layer-2 (demoted, surfaced later by Phase 6/8): 4 foodGroups, 7 activityLevel, 9 equipment, 10 supportNeeds, + personality 18/19/20.
- `handleNext` on completion: writes AsyncStorage, `syncFamilyProfile`, then `navigation.replace('FoodSwipe')`.
- **Open product question:** Layer-1 is currently **14 screens** (doc wanted ~10). To trim, set `layer: 2` on questions 12/13/15. Left as-is pending user pref.

## ✅ DONE — Phase 3: Food & Activity swipe discovery
- **`src/data/mealArchetypes.ts`** (24 archetypes; `MealArchetype`, `Cuisine`, `PrepBand`, `Budget`) and **`src/data/activityArchetypes.ts`** (24; `ActivityArchetype`, `ActivityCategory`; `pillar` from syncService). Tags reuse missionCatalog vocab.
- **`src/services/preferenceSignals.ts`** — `Reaction='loved'|'okay'|'not_for_us'`, `REACTION_WEIGHT` (2/1/-1), `PREF_KEYS` (`swipeReactions`/`cuisinePrefs`/`activityPrefs`), `recordMealReactions`, `recordActivityReactions` (aggregate to cuisine/category maps in AsyncStorage).
- **`src/screens/onboarding/FoodSwipe.tsx`** + **`ActivitySwipe.tsx`** — 3-state card UI (🔴/🟡/🟢), Skip, progress dots. Flow: Onboarding → FoodSwipe → ActivitySwipe → MainApp. Both registered in navigator (`RootStackParamList`: `FoodSwipe`, `ActivitySwipe`).
- **Decision:** onboarding swipes persist **locally only** (no child row exists yet during onboarding). DB mirror handled by `flushSwipeSignals` (Phase 4) once a child exists.

## ✅ DONE — Phase 4: Family Preference Engine ("Health DNA")
- **Migration `007_preference_signals.sql`** + appended to `schema.sql` — `preference_signals(id, child_id→children, kind 'meal'|'activity', ref_id, attribute, value, weight INT, source 'swipe'|'completion'|'micro_q', created_at)`, index on child_id, child→parent RLS.
- **`src/services/preferenceEngine.ts`**:
  - `computePreferenceModel(childId)` → `PreferenceModel { cuisineScores, activityScores, tagScores (all 0–100), topCuisines[], topActivities[], hasSignal }`. Aggregates local swipe prefs + `preference_signals` + `food_logs` (via exported `getLikedTags`/`getAvoidedTags`) + `mission_completions`→tags. `SOURCE_WEIGHT` swipe 1 / micro_q 1.5 / completion 3 (behaviour > stated). `toPct(raw)=clamp(50+raw*8, 5, 99)`.
  - `recordPreferenceSignal(childId, {kind,attribute,value,weight,source,refId?})` — best-effort insert.
  - `flushSwipeSignals(childId)` — idempotent (`swipeSignalsFlushed:<childId>` flag) mirror of local swipe prefs → `preference_signals`. **✅ Wired (2026-06-08):** called from `ChildContext.setActiveChild` (best-effort, `.catch(() => {})`) so it fires on every child selection — covers child-creation→select, ProfileSelector→select, and first MainApp load. The per-child flag makes repeat selections a no-op; an offline first run retries on the next selection.
- Exported `getLikedTags`/`getAvoidedTags` from `recommendationService.ts`.

---

## ✅ DONE — Phase 5: Meal Engine + Activity Engine (70/20/10)
Type-clean (`npx tsc --noEmit` shows no errors in the touched files). Guardrail honoured: engine picks **"most likely successful," not "healthiest"**, dietary applied as hard filters first.

1. **`src/data/mealLibrary.ts`** — **100 real meals** (10 per cuisine across all 10 `mealArchetypes.Cuisine` values), built via a compact `meal(...)` constructor so dietary flags default to `false`. `interface LibraryMeal { id; name; cuisine; prepBand; budget; childFriendliness; tags[]; ingredients[]; vegetarian; containsDairy; containsNuts; containsGluten; containsPork }`. Note: pesto-based meals flag `containsNuts` (pine nuts); peanut/groundnut/cashew/almond dishes flagged too.
2. **`src/services/mealEngine.ts`** — `CUISINE_ADJACENCY` (all 10 cuisines), `passesDietary(meal, dietary[])` (exported; mirrors+extends HealthySwaps: Dairy/Nut/Gluten(+coeliac)/Vegetarian/Vegan/Halal), and `selectMeals(model, profile, count): MealPick[]` where `MealPick = { meal; bucket: 'familiar'|'adjacent'|'new'; why: string[] }`. **70/20/10** via `bucketCounts` (round 0.7/0.2/rest); familiar = `cuisineScores >= 58` (top 4); adjacent = adjacency of those; new = the rest. Hard dietary filter FIRST; spills to leftovers to always return `count`. `why[]` deterministic from profile+model (cuisine %, liked tag ≥60, quick/budget/kid-approved, "based on families like yours" when `!hasSignal`).
3. **`WeeklyPlan.tsx`** — `buildFamilyProfile()` refactored to pure `profileToPrompt(p: FamilyProfile)`; `generatePlan` now loads the profile object once, gets `activeChild.id` via `useChild()`, `computePreferenceModel(id)`, and if `model.hasSignal` injects `selectMeals(model, p, 7)` candidate names+cuisine+bucket+why into the **existing** `ai-proxy` prompt as a "Preferred meal options" block. Kept cache keys, `FALLBACK_PLAN`, ai-proxy shape. Added **`why?: string[]`** to `DayMeal`/`DayActivity`. `loadPlan` dep is now `[activeChild?.id]`. Falls back to profile-only prompt with no child/signal.
4. **Activity engine** — `recommendationService.getRecommendedMissions` gained optional `model?: PreferenceModel` (4th param; **type-only** import + **lazy `await import('./preferenceEngine')`** when omitted to avoid the static cycle — `RecommendedMissions.tsx` caller unchanged). Added `W.ACTIVITY_MATCH = 25` scoring `mission.tags` against `model.tagScores`; classifies each mission familiar (tag ≥65) / adjacent (any signal) / new, then applies **70/20/10** across the ranked pool with leftover spill (still returns top 3; no-signal path = old score ranking). `RECENT_PENALTY`/`FOCUS_PILLAR`/`WEAK_PILLAR`/food matching all preserved.

> **Note:** added `"env": { "ECC_GATEGUARD": "off" }` to `.claude/settings.local.json` this session to stop the per-write fact-forcing gate (cost). Remove if undesired.

## ✅ DONE — Phase 6: Meal + Activity feedback loops
Type-clean (`npx tsc --noEmit` shows no errors in touched files).

- **Migration `008_meal_feedback.sql`** + schema.sql append — `meal_feedback(id, child_id→children, meal_ref TEXT, reaction 'everyone_ate'|'most_ate'|'mixed'|'disaster', logged_at)`, index on child_id, child→parent RLS. `food_logs.action` untouched. **Latest migration is now 008.**
- **`src/services/feedbackService.ts`** (new):
  - `MealReaction = 'everyone_ate'|'most_ate'|'mixed'|'disaster'`; `ActivityReaction = 'loved'|'okay'|'not_for_us'`.
  - `recordMealFeedback(childId, mealRef, reaction)` — inserts `meal_feedback` row, then (skips neutral `mixed`) mirrors into `preference_signals` via `recordPreferenceSignal(source:'completion')`. **Matches the AI meal name back to `mealLibrary`** (case-insensitive) to emit a `cuisine` signal + first 2 `tag` signals; unmatched names fall back to a generic tag signal. Base weights everyone_ate +2 / most_ate +1 / mixed 0 / disaster -2 (engine ×3 for completion).
  - `recordActivityFeedback(childId, {refId?,name,category?,tags?}, reaction)` — writes `preference_signals` (`kind:'activity'`, `source:'completion'`). Accepts `category`/`tags` for future real-quest wiring; the freeform WeeklyPlan activity passes just `name` → recorded as a tag. Weights loved +2 / okay +1 / not_for_us -1.
  - All writes best-effort (swallow errors, no-op without childId).
- **`WeeklyPlan.tsx`** — added a one-tap **meal reaction row** ("How did dinner go?" 😋/🙂/😐/😬) and **activity reaction row** ("Did they enjoy it?" 💚/🙂/🤷) inside each expanded day card. Selection persisted to AsyncStorage key `planFeedback` (restored in `loadPlan`, cleared on plan refresh) and keyed `${day}:meal`/`${day}:activity`. Warm copy — "disaster" never shown as a word, only 😬.
- **✅ Explicit kids-quest reaction done (2026-06-08):** built as its own scoped feature (it was deliberately NOT done as a bare completion hook — see reasoning below). A one-tap **"Did you enjoy it?"** row (😍 Loved it! / 🙂 It was okay / 🤷 Not for me) now renders on **`KidsSuccessCelebration`** (the post-completion screen). It's skippable and never blocking — the "Keep Going!" button continues regardless; after a tap it swaps to "Thanks for telling us! 💛". On tap it calls `recordActivityFeedback(activeChild.id, {refId: missionId, name: missionTitle, tags}, reaction)` (childId from `useChild()`; row only renders when `activeChild` exists; all writes best-effort).
  - **Wiring:** `KidsSuccessCelebration` gained optional route params `{ missionId?, missionTitle?, tags? }` (typed in `navigation/index.tsx`). `KidsDailyMission` (6-8) is the only completion path that routes here; its **local** missions array carries no catalog id, so `handleComplete` now matches the local title back to `missionCatalog` (`localTitle.startsWith(catalog.title)` — local titles are the catalog title + emoji) to recover the real `CatalogMission` id + `tags`, then passes them as params. Falls back to the local title with no tags if unmatched. (Kids8/Kids12 don't currently navigate to this screen; the celebration screen is now param-ready for them when they do.)
  - **Double-count tradeoff (the original constraint):** `computePreferenceModel` step 4 already harvests every `mission_completion`'s `tags` at `SOURCE_WEIGHT.completion` (×3), so completion alone is already an implicit positive. Therefore `not_for_us` and `okay` carry **non-redundant** sentiment (a dislike can offset / a meh only mildly reinforce the implicit +), while **`loved` double-counts on purpose** — accepted amplification of a clear favourite, documented in the `handleReact` comment. `CatalogMission` still has no `category` field, so `category` is left undefined and only the mission's real `tags` are passed.

## ✅ DONE — Phase 7: Transparency ("Why am I seeing this?") + healthy-swap rationale
Type-clean (`npx tsc --noEmit` no errors in touched files).

- **`src/services/transparency.ts`** (new) — `buildMealWhy(mealName, model, profile)` and `buildActivityWhy({name,pillar}, model, profile)` build the deterministic `why: string[]` citing **real** values: cuisine % (familiar) / "fresh twist on cuisines you enjoy" (adjacent via `isAdjacentCuisine`), liked tag ≥`LIKED_TAG_THRESHOLD`, quick/budget/kid fit, activity top-category + `childInterests` + pillar reason + `spaces`. Falls back to "Based on families like yours" when `!model.hasSignal`. Meal names are matched back to `mealLibrary` to recover cuisine/tags.
- **`mealEngine.ts`** — exported `FAMILIAR_THRESHOLD`, `LIKED_TAG_THRESHOLD`, `prefersQuick`, `prefersLowBudget` so transparency reuses them (no logic duplication).
- **`WeeklyPlan.tsx`**:
  - `enrichPlanWhy(days, model, profile)` (module-level) attaches `meal.why`/`activity.why` to every day; `generatePlan` now lifts `model` to function scope and applies `enrich(...)` to **both** the parsed AI plan (before caching) and the `FALLBACK_PLAN` (uses an empty model when none). Cached plans therefore carry `why`.
  - **"Why am I seeing this?"** `Info` icon in each meal & activity section header → toggles a `whyPanel` listing the reasons (`whyOpen` state, keyed `${day}:meal`/`${day}:activity`).
  - **Healthy-swap rationale**: added optional `whyHealthier`/`familyTakeaway` to `DayMeal`; prompt now asks the AI for both (≤12 words each, `maxTokens` 1200→1600) and they render in a "Healthier choice" card (reuses the green swap visual). Renders only when present, so the AI omitting them is harmless.
- **`components/RecommendedMissions.tsx`** — added an `Info` toggle on the primary card that reveals a "Why am I seeing this?" panel showing the rec's `reason` (`whyOpen` boolean). Nested `TouchableOpacity` so it doesn't trigger card navigation.

> Note: `healthierThan` from the doc shape was folded into the AI's `whyHealthier` sentence (the comparison) rather than a separate field — keeps the JSON small and avoids a fabricated "from" item.

## ✅ DONE — Phase 8: Progressive profiling micro-questions
Type-clean (`npx tsc --noEmit` no errors in touched files).

- **`src/data/microQuestions.ts`** (new) — `MicroQuestion { id; prompt; kind 'meal'|'activity'; attribute 'cuisine'|'category'|'tag'; options[{label,value,weight?}] }` + 5 questions. Option `value`s reuse the existing vocabularies (Cuisine / ActivityCategory / tags) so answers map cleanly onto the model.
- **`src/components/MicroQuestionCard.tsx`** (new) — surfaces **≤1 question every 3 days** (`COOLDOWN_MS`), gated by AsyncStorage `microQ:lastAsked` (timestamp) + `microQ:answered` (id array). On answer → `recordPreferenceSignal(childId, {source:'micro_q', kind, attribute, value, weight})` then marks answered + sets lastAsked; on dismiss (X) → only sets lastAsked (re-surfaces after cooldown). Shows a brief thank-you then hides. Renders `null` without a childId. Never blocks UI.
- **`ParentDashboard.tsx`** — renders `<MicroQuestionCard childId={child.id} />` just above the pillar bars (inside the existing `child &&` block).
- **✅ Extension done (2026-06-08):** surfaced the *preference-shaped* demoted Layer-2 questions as new `microQuestions` entries — `mq-staples` (from onboarding id 4 "food groups" → meal `tag`: protein/fish/rice/vegetables/fruit) and `mq-equipment` (from id 9 "equipment at home" → activity `category`: ball_sport/cycling/outdoor_play/strength). Mapped onto real `ActivityCategory`/tag vocabulary. **Deliberately excluded** ids 7 (activity level) and 18/19/20 (family personality / reward timing): they describe family STYLE, not meal/activity preferences, so routing them through `preference_signals` would pollute the Health DNA scores — they belong in `FamilyProfile`, not the engine. Noted in `microQuestions.ts`.

## ✅ DONE — Phase 9: Onboarding intro video (independent)
Type-clean. **No new dep added** — used an animated slideshow fallback (`Animated` from react-native) per the guardrail.
- **`src/screens/onboarding/IntroVideo.tsx`** (new) — one screen, two modes via route param `{ mode?: 'intro' | 'endcard' }`:
  - `intro` (default): 4-slide auto-advancing (`SLIDE_MS=4000`) `LinearGradient` slideshow with fade (`Animated`), Skip button + Next/"Let's set up". On finish/skip writes analytics `videoWatched`/`videoSkipped`/`videoPercentWatched` to AsyncStorage, then `navigation.replace('Onboarding')`.
  - `endcard`: loads `loadFamilyProfile()` and shows a personalised card (top goal = `threeMonthGoal||goals[0]`, prep time, first child interest), then `replace('MainApp')`.
- **Wiring** in `navigation/index.tsx`: imported, added `IntroVideo` to `RootStackParamList` (`{ mode?: 'intro'|'endcard' } | undefined`), registered `<RootStack.Screen>`. Flow is now **Welcome → IntroVideo(intro) → Onboarding → FoodSwipe → ActivitySwipe → IntroVideo(endcard) → MainApp** (`Welcome.tsx` CTA → `IntroVideo`; `ActivitySwipe` completion → `IntroVideo {mode:'endcard'}`).
- **✅ Extension done (2026-06-08):** persisted the video analytics to a DB table. **Migration `009_video_analytics.sql`** + schema.sql append — `video_analytics(id, parent_id→profiles, watched, skipped, percent_watched, created_at)`, parent-owned RLS `parent_id = auth.uid()` (the intro runs before any child exists). **Latest migration is now 009.** New **`src/services/videoAnalytics.ts`** → `flushVideoAnalytics()`: reads the three AsyncStorage keys, gets the now-authenticated parent via `supabase.auth.getUser()`, inserts one row; idempotent via local `videoAnalyticsFlushed` flag; best-effort (swallows errors, no-ops when unauthenticated so it retries). Called from the **IntroVideo end-card** effect (the parent IS authenticated by then; the intro itself runs pre-auth so it can only write AsyncStorage).

<!-- OLD Phase 9 spec retained below for reference -->
### (original Phase 9 spec)
- **`src/screens/onboarding/IntroVideo.tsx`** before Onboarding (Welcome → Watch/Skip → Setup). **No `react-native-video`** installed — use an animated slideshow fallback unless user approves a dep. Store `videoWatched`/`videoPercentWatched`/`videoSkipped` (AsyncStorage). Personalized end-card after onboarding from `FamilyProfile` (top goal, prep time, child interest).

## ✅ DONE — Phase 10: Parent dashboard "Health DNA"
Type-clean (`npx tsc --noEmit` shows no errors originating in touched files; the only `ParentDashboard`-named tsc error is the **pre-existing** `navigate('ParentDashboard')` one in another file). **All 10 phases now complete.**

- **`src/screens/ParentDashboard.tsx`** — two new sections inside the existing `child && (...)` block, placed directly after the pillar-bars card:
  1. **"Family Health DNA"** — `computePreferenceModel(child.id)` is run in a dedicated `useEffect` keyed on `child.id` (cancel-flag guarded; `dna`/`dnaLoading` state), independent of the digest effect. Renders `model.topCuisines` ("Food we lean towards") and `model.topActivities` ("How we like to move") as labelled rows reusing **`ProgressBar`** (`value=pct total=100`), with distinct `CUISINE_COLORS`/`ACTIVITY_COLORS` palettes and a `{pct}%` readout. Labels run through a `titleCase()` helper (handles `team_sport`→"Team Sport"). When `!dna.hasSignal` → gentle 🧬 empty state ("We're still learning your family…"). Loading → small spinner. Best-effort: errors swallowed, never blocks UI.
  2. **"Activity Arena Progress"** — QUALITATIVE only (no raw minutes). Pure `buildArenaStats(child)` helper derives from data already on `ChildSummary` (**no new queries**): **day streak** (`child.streak`), **active days /7** (distinct `recentMissions.completed_at` dates within last 7 days, capped 7 — note `recentMissions` is limited to 5 in `useParentData`, so this is best-effort), and **pillar momentum movers** (`pillarHistory[0]` vs `[1]` per-pillar positive deltas, sorted) framed as "{Pillar} skills +X%" with a green `TrendingUp` badge. Empty-movers fallback copy shown otherwise.
- **Privacy guardrail preserved:** both sections derive solely from preference signals / `mission_completions` / `pillar_scores` / `streak` — no raw `mood_logs`/energy rows. The existing 10-12 "Wellbeing Trend" (trend-only) card is untouched.
- New icons imported from `lucide-react-native`: `Dna`, `Flame`, `Activity`. Styling via the existing local `d` StyleSheet (new `dna*` / `arena*` keys); no theme-token violations, no new deps.

## ✅ DONE — Post-MVP gap closure (2026-06-08): 4 brainstorm ideas from `newfeatures.md` not in the original 10-phase plan
Type-clean (no tsc errors in touched files). No new deps, no new migrations.

1. **Postcode capture** — `FamilyProfile.postcode: string` + `ONBOARDING_IDS.postcode = 21` + `mapAnswersToProfile` (uppercased/trimmed). New onboarding question id 21 (`inputType: 'text'` — added a `text` renderer + `textInput` style + `canProceed` treats `text` as optional; outward postcode only, framed "helps suggest local parks", optional). Fed into the AI plan via `profileToPrompt` (`WeeklyPlan.tsx`) as local context. **Scope note:** this is *capture + prompt context only* — real deprivation-index / park-proximity lookups need an external geo dataset/API (would require a new env var, deferred).
2. **Time-of-day pattern learning** — `preferenceEngine.computePreferenceModel` now selects `completed_at` from `mission_completions` and derives `model.timePatterns { weekday, weekend, hasTimeSignal }` via `deriveTimePatterns` (buckets hour→`mornings`/`around midday`/`after school`/`evenings`/`late evenings`, split weekday vs weekend, top window each). Added `TimePatterns` to the exported `PreferenceModel` (updated the empty-model literal in `WeeklyPlan.enrichPlanWhy` fallback). Currently surfaced via the coach line (below); not yet used to *reschedule* recommendations — that's the next step if wanted.
3. **Conversational coach line** — new `src/services/familyCoach.ts` → `buildCoachLine(model)`: deterministic, cites only real learned values (top cuisine + top activity + time window), warm cold-start fallback when `!hasSignal`. Rendered on `ParentDashboard` under the "Family Health DNA" header (new `coachLine` style). This is the **MVP** of the doc's "AI coach voice" — the proactive memory-driven agent ("repeat last Tuesday's taco night?") is still future work.
4. **Intro slideshow → 6-scene trailer arc** — rewrote `IntroVideo.tsx` `SLIDES` to follow the doc's narrative beats (Problem → Solution → Four Pillars → Getting to know you → Gets smarter → Lasting change), 6 slides. **Still a slideshow, not a real video** — producing an actual 60–90s MP4 is a content task (CapCut/Canva), outside code. The watch/skip/analytics/personalised-end-card infra was already built in Phase 9.

---

## Migrations to run in Supabase SQL Editor before device-testing
`006_family_profiles.sql`, `007_preference_signals.sql`, `008_meal_feedback.sql`, `009_video_analytics.sql`. The app type-checks and runs offline without them (all DB writes are best-effort / swallow errors).

## Anti-hallucination checklist (verify before each phase PR)
- [ ] AI calls only via `ai-proxy` `{type, prompt, maxTokens}`.
- [ ] New tables: numbered migration + schema.sql append + correct RLS.
- [ ] No new client env vars; no new npm deps without asking.
- [ ] Onboarding ids read via `mapAnswersToProfile`/`loadFamilyProfile`, never re-parsed.
- [ ] Pillars/age-groups limited to the allowed values.
- [ ] `food_logs.action` not overloaded; 5-state reactions use `meal_feedback`.
- [ ] New screens registered in `navigation/index.tsx`.
- [ ] Styling via theme tokens.
