# HabitQuest — `newfeatures.md` Implementation Plan

> Purpose: turn the strategy doc `newfeatures.md` into a build plan grounded in the **actual** codebase so an AI coding agent does not invent files, tables, env vars, or APIs.
> Read the "Ground Truth" section first. Every phase references real paths, tables, and function signatures that exist today.

---

## 0. Ground Truth (READ BEFORE CODING — do not violate)

**Stack:** bare React Native 0.85 (not Expo) + TypeScript + Supabase. Navigation: `@react-navigation/native-stack`. Icons: `lucide-react-native`. Gradients: `react-native-linear-gradient`. No Tailwind — styling is `StyleSheet.create` + tokens from [src/theme.ts](src/theme.ts) (`colors`, `typography`, `radius`, `withOpacity`).

**AI access — ONE path only.** All model calls go through the Supabase Edge Function `ai-proxy`:
```ts
const { data, error } = await supabase.functions.invoke('ai-proxy', {
  body: { type: 'recommendations' | 'digest', prompt, maxTokens },
});
// returns { text: string | null }
```
- `type: 'recommendations'` → DeepSeek-V3, `type: 'digest'` → gpt-4.1 (see [supabase/functions/ai-proxy/index.ts](supabase/functions/ai-proxy/index.ts)).
- **Do NOT** add OpenAI/Anthropic SDKs, do NOT put model API keys in the app. Azure keys live only as Edge Function secrets.
- Client `@env` only exposes `SUPABASE_URL`, `SUPABASE_ANON_KEY` (see [src/types/env.d.ts](src/types/env.d.ts)). Do not reference other env vars from app code.
- **Known latent bug:** [src/services/aiAgentService.ts](src/services/aiAgentService.ts) guards on bare globals `DEEPSEEK_AZURE_ENDPOINT`, `GPT41_AZURE_ENDPOINT` that are **never defined client-side** → those branches throw `ReferenceError` (caught) or are dead. When touching that file, replace those guards with a feature flag from storage/config; do not assume those constants exist.

**Database:** Postgres via Supabase. Full schema in [supabase/schema.sql](supabase/schema.sql); incremental changes in `supabase/migrations/00X_*.sql` (latest is `005_push_tokens.sql`). **Every new table must:** (a) be a new numbered migration `supabase/migrations/006_*.sql`, (b) be appended to `schema.sql`, (c) enable RLS with the established ownership pattern:
```sql
child_id IN (SELECT id FROM children WHERE parent_id = auth.uid())
```
Existing relevant tables and their **exact** columns:
- `children(id, parent_id, name, age_group ['6-8'|'8-10'|'10-12'], avatar, sport, xp, level, streak, ...)`
- `food_logs(id, child_id, food_item TEXT, action ['tried'|'liked'|'skipped'|'repeated'], logged_at)`
- `mission_completions(id, child_id, mission_id TEXT, mission_title, pillar, xp_earned, completed_at)`
- `pillar_scores(id, child_id, nutrition_score, movement_score, sleep_score, confidence_score, week_start, ...)`
- `mood_logs` (10-12 only, parent never reads raw rows)
- Pillars are exactly: `'nutrition' | 'movement' | 'sleep' | 'confidence'`.

**Onboarding storage (local, not DB today):** [src/screens/Onboarding.tsx](src/screens/Onboarding.tsx) writes `AsyncStorage['onboardingAnswers']` = `Record<questionId, string|string[]>` and `AsyncStorage['onboardingComplete']='true'`. Question IDs are **non-contiguous**: `0,1,2,3,4,5,11,6,7,8,9,10`. Readers that already depend on this shape — **you must keep them working or migrate them together**:
- [src/utils/personalization.ts](src/utils/personalization.ts) (`OnboardingData` interface — note it is missing id `11`/budget today)
- [src/screens/WeeklyPlan.tsx](src/screens/WeeklyPlan.tsx) `buildFamilyProfile()`
- [src/screens/HealthySwaps.tsx](src/screens/HealthySwaps.tsx)

**Existing building blocks to REUSE, not recreate:**
| Concept in doc | Already exists | File |
|---|---|---|
| Weekly meal+activity plan (AI + fallback, cached daily) | yes | [src/screens/WeeklyPlan.tsx](src/screens/WeeklyPlan.tsx) |
| Mission catalog w/ `tags`, `pillar`, `ageGroup`, `difficulty` | yes | [src/data/missionCatalog.ts](src/data/missionCatalog.ts) |
| Recipe library (typed `Recipe`) | yes | [src/data/recipes.ts](src/data/recipes.ts) |
| Local preference scoring (liked/skipped tags) | yes | [src/services/recommendationService.ts](src/services/recommendationService.ts) |
| AI mission picks + parent digest | yes | [src/services/aiAgentService.ts](src/services/aiAgentService.ts) |
| Healthy swaps w/ from/to/why/savings | yes (static) | [src/screens/HealthySwaps.tsx](src/screens/HealthySwaps.tsx) |
| Onboarding flow | yes | [src/screens/Onboarding.tsx](src/screens/Onboarding.tsx) |
| Parent dashboard | yes | [src/screens/ParentDashboard.tsx](src/screens/ParentDashboard.tsx) |
| Pantry mode | yes | [src/screens/PantryMode.tsx](src/screens/PantryMode.tsx) |

**Screen registration:** new screens must be added to the navigator and `RootStackParamList` in [src/navigation/index.tsx](src/navigation/index.tsx). Confirm the exact param-list name and stack structure there before adding (do not assume route names).

---

## Feature inventory (what `newfeatures.md` actually asks for)

1. **Layered onboarding** (60s core → progressive profiling → behavioural learning).
2. **Food & Activity "Tinder"** swipe discovery (archetype cards, 3-state reaction).
3. **Family Preference Model / "Health DNA"** (persistent, drives everything).
4. **Meal Engine V1** — classified meal library + **70/20/10** familiar/adjacent/new rule.
5. **Activity/Quest Engine** — identity-based, 70/20/10, per-child interest.
6. **Meal + activity completion feedback** ("Did everyone eat it?" 5-state; quest loved→hated).
7. **Healthy-swap rationale on meals** — "why healthier" + reusable family takeaway.
8. **"Why am I seeing this?"** transparency button on every recommendation.
9. **Progressive profiling** micro-questions (periodic, 1 at a time).
10. **Onboarding intro video** (60–90s, watch/skip, analytics, personalized end-card).
11. **Parent dashboard Health DNA** (cuisine %, activity %, qualitative "Activity Arena" progress).

These have dependencies — build in the phase order below.

---

## Phase 1 — Canonical Family Profile + DB foundation

**Why first:** every other feature reads/writes the family profile. Today it's an untyped `Record<number,...>` in AsyncStorage. Make it typed and persisted.

**Do:**
1. Create `src/data/familyProfile.ts`:
   - Export `interface FamilyProfile` with explicit fields derived from existing onboarding answers: `goals: string[]`, `childAge: number|null`, `cultures: string[]`, `foodGroups: string[]`, `prepTime: string`, `budget: string`, `dietary: string[]`, `activityLevel`, `spaces: string[]`, `equipment: string[]`, `supportNeeds: string[]`. Plus new fields added later (`cuisinePrefs`, `activityPrefs`, `familyPersonality`).
   - Export `mapAnswersToProfile(answers: Record<number,string|string[]>): FamilyProfile` — single source of truth for the non-contiguous id mapping (`3`=cultures, `5`=prepTime, `11`=budget, etc.). **Reuse the id map already implied** by `WeeklyPlan.buildFamilyProfile` and `personalization.ts` — do not invent new ids.
2. Migration `supabase/migrations/006_family_profiles.sql` + append to `schema.sql`:
   ```sql
   CREATE TABLE family_profiles (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     parent_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
     profile JSONB NOT NULL DEFAULT '{}',
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );
   -- RLS: parent_id = auth.uid()
   ```
   Store the whole `FamilyProfile` as JSONB (avoids a column-per-answer migration treadmill).
3. Refactor `personalization.ts`, `WeeklyPlan.buildFamilyProfile`, `HealthySwaps` to consume `mapAnswersToProfile` instead of re-parsing raw answers. Add the missing budget (id `11`) to the typed reader.

**Guardrails:** keep writing `AsyncStorage['onboardingAnswers']` (offline-first); the DB row is a synced mirror. Don't break the existing keys.

---

## Phase 2 — Onboarding redesign (layered)

**Extends** [src/screens/Onboarding.tsx](src/screens/Onboarding.tsx) — it already has a clean data-driven `questions[]` + single/multi-select renderer. **Reuse that pattern**; add question types, don't rewrite the engine.

**Do:**
1. Reorder/extend `questions[]` to match the doc's Layer-1 "60-second" set: motivation (already id 2), family structure, busy-ness + prep time (id 5), budget (id 11), cuisines (id 3), difficult foods, child interests, activity spaces (id 8), barriers, 3-month success. Keep IDs stable; append new IDs (`12,13,...`) for genuinely new questions and register them in `mapAnswersToProfile`.
2. Add a short **Family Personality** mini-quiz (organised/flexible/chaotic; structure/variety/mix; reward timing) as new question IDs → stored in `FamilyProfile.familyPersonality`.
3. Add a `slider` `inputType` to the `Question` interface for "How busy are weekdays?" (the renderer currently supports `text`/`textarea`/options only — extend it).

**Guardrails:** do not exceed ~10 required screens for Layer 1 (the doc's core thesis is anti-fatigue). Everything else is Phase 6 progressive profiling. Persist via existing `handleNext` → `storage.setItem('onboardingAnswers', ...)`, then also upsert to `family_profiles`.

---

## Phase 3 — Food & Activity "Tinder" swipe discovery

**New, slots into onboarding after Layer-1 questions.**

**Do:**
1. Data: `src/data/mealArchetypes.ts` and `src/data/activityArchetypes.ts`. Start with **20–30 each** (doc says that's enough for MVP). Each archetype carries the classification signals the engine learns from:
   ```ts
   interface MealArchetype { id; title; emoji; cuisine; cookingStyle; childFriendliness; budget; prepBand; tags: string[]; }
   interface ActivityArchetype { id; title; emoji; category; indoor: boolean; competitive: boolean; solo: boolean; pillar: Pillar; tags: string[]; }
   ```
   Reuse the `tags`/`pillar` vocabulary already in `missionCatalog.ts` so signals are interoperable.
2. Screens: `src/screens/onboarding/FoodSwipe.tsx`, `src/screens/onboarding/ActivitySwipe.tsx`. Card UI with **3-state** reaction (doc: loved 🟢 / okay 🟡 / not-for-us 🔴) — not binary. `react-native-gesture-handler` is already a dependency for swipe; buttons are an acceptable fallback.
3. Persist reactions into `FamilyProfile.cuisinePrefs` / `activityPrefs` (Phase 4 turns these into scores) and mirror to a new `preference_signals` table.

**Guardrails:** archetypes are **patterns**, not real recipes. Do not try to generate 150 real recipes here — that's the engine's job (Phase 5) at plan time.

---

## Phase 4 — Family Preference Engine (the "Health DNA")

**New service `src/services/preferenceEngine.ts`.** This is the doc's core moat.

**Do:**
1. Migration `007_preference_signals.sql`: table capturing every preference event with a unified shape so onboarding swipes, meal feedback, and quest feedback all feed one model:
   ```sql
   preference_signals(id, child_id, kind ['meal'|'activity'], ref_id TEXT, attribute TEXT, value TEXT,
                      weight INT DEFAULT 1, source ['swipe'|'completion'|'micro_q'], created_at)
   ```
   RLS via the child→parent pattern. (Append to `schema.sql`.)
2. `computePreferenceModel(childId)` → `{ cuisineScores: Record<string,number>, activityScores, timePrefs, ... }`. Aggregate `preference_signals` + existing `food_logs` (liked/repeated vs skipped) + `mission_completions` completion rates per tag. **Reuse** the liked/skipped query logic in `recommendationService.getLikedTags/getAvoidedTags`.
3. Surface as percentages (doc: "Indian 95%", "Football 98%").

**Guardrails:** behaviour > stated preference (doc, repeatedly) — weight `source:'completion'` higher than `source:'swipe'`. Keep this deterministic/local; no AI call needed to compute the model.

---

## Phase 5 — Meal Engine + Activity Engine (70/20/10)

**Extend** `WeeklyPlan.generatePlan` and mission recommendation rather than replacing them.

**Do:**
1. `src/data/mealLibrary.ts`: grow toward the doc's 100–150 meals classified by cuisine (British/Caribbean/Indian/Pakistani/Chinese/Mediterranean/Middle Eastern/African) + `prepBand` + `budget` + `childFriendliness`. Can reference existing `recipes.ts` entries.
2. In `preferenceEngine` (or new `mealEngine.ts`): implement the **70% familiar / 20% adjacent / 10% new** selection rule (doc, "The Rule I Would Give Developer"). Define an explicit cuisine-adjacency map (e.g. Indian→Middle Eastern→Mediterranean).
3. `WeeklyPlan.generatePlan`: build the AI prompt **from the preference model**, and pass the 70/20/10 picks as candidates. Keep the existing `ai-proxy` call, the daily cache keys (`weeklyPlan`, `weeklyPlanDate`), and `FALLBACK_PLAN`. Add `why: string[]` to the `DayMeal`/`DayActivity` types for Phase 7/8.
4. Activity engine: extend `recommendationService.getRecommendedMissions` scoring (the `W` weights block) with preference-model activity scores, and apply 70/20/10 across the top picks. Do not remove the existing `RECENT_PENALTY`/`FOCUS_PILLAR` logic.

**Guardrails:** the engine picks **"most likely successful," not "healthiest"** (doc, line 199-201). Respect dietary/allergy fields from `FamilyProfile` as hard filters (mirror the allergy filter already in `HealthySwaps`).

---

## Phase 6 — Meal + Activity feedback loops

**The doc's single most important signal: "Did everyone actually eat it?"**

**Do:**
1. Migration `008_meal_feedback.sql`:
   ```sql
   meal_feedback(id, child_id, meal_ref TEXT, reaction
       ['everyone_ate'|'most_ate'|'mixed'|'disaster'], logged_at)
   ```
   (5-state per doc; `food_logs.action` enum is only tried/liked/skipped/repeated — do **not** overload it, use this table.) Activity reactions can reuse `preference_signals` with `kind:'activity'`.
2. UI: reaction row on each `WeeklyPlan` meal card and after each quest. On submit → write `meal_feedback` + a derived `preference_signal` (`source:'completion'`).
3. Feed straight into `preferenceEngine` so next week's plan adapts.

**Guardrails:** keep reactions one tap. Parent-facing copy stays warm/non-judgemental ("Disaster" is internal; show 😬 etc).

---

## Phase 7 — Transparency: "Why am I seeing this?" + healthy-swap rationale

**Do:**
1. Each generated meal/activity gets a `why: string[]` populated from the actual profile inputs used (doc's example: "You have 20 mins / child likes Mexican / budget-friendly / enjoyed fajitas last week"). Build this list **deterministically from the preference model + profile**, not from a separate AI call.
2. Add a "Why am I seeing this?" affordance (info icon → modal/expand) on `WeeklyPlan` cards and recommended-mission cards ([src/components/RecommendedMissions.tsx](src/components/RecommendedMissions.tsx)).
3. Healthy swaps: extend each meal recommendation with `healthierThan`, `whyHealthier`, `familyTakeaway` (doc Meal Examples 1–4). `HealthySwaps.tsx` already has from/to/why — extend that data shape and reuse the card.

**Guardrails:** reasons must cite **real** stored values, never fabricated history. If no signal exists yet, say "based on families like yours" (doc's population→family transition).

---

## Phase 8 — Progressive profiling micro-questions

**Do:**
1. `src/data/microQuestions.ts` (doc examples: "What meal was easiest this week?", "Which quest did your child enjoy most?").
2. Lightweight surfacing on `ParentHome`/`ParentDashboard` — at most one every few days; gate with an `AsyncStorage` last-asked timestamp.
3. Answers → `preference_signals` (`source:'micro_q'`).

**Guardrails:** never block the UI; dismissible; rate-limited.

---

## Phase 9 — Onboarding intro video

**Do:**
1. New `src/screens/onboarding/IntroVideo.tsx` shown on first launch before Onboarding (doc: Welcome → Watch/Skip → Setup). Use a simple video component; if no native video dep is desired, fall back to an animated slideshow (the doc explicitly endorses a cheap illustrated explainer).
2. Analytics: store `videoWatched`, `videoPercentWatched`, `videoSkipped` (AsyncStorage now; table later) for retention correlation (doc, lines 870-874).
3. Personalized end-card after onboarding completes: "Welcome to HabitQuest, the {familyName} family — we'll help around {topGoal}, {prepTime} meals and {childInterest}." Pull from `FamilyProfile`.

**Guardrails:** confirm a video dependency before adding one — none is in `package.json` today (`react-native-video` is NOT installed). Prefer the slideshow fallback unless the user approves adding a dep.

---

## Phase 10 — Parent dashboard "Health DNA"

**Do:**
1. In [src/screens/ParentDashboard.tsx](src/screens/ParentDashboard.tsx): add a "Family Preference / Health DNA" section rendering `computePreferenceModel` output as bars (cuisine %, activity %). Reuse `src/components/ui/ProgressBar.tsx`.
2. "Activity Arena Progress" — qualitative framing (doc: "Football skills +20%", "Active days 5/7", streak), **not** raw minutes. Derive from `mission_completions` + `pillar_scores` + `children.streak`.

**Guardrails:** preserve the 10-12 privacy rule — mood/energy shown as trends only, never raw rows (already enforced in `aiAgentService.buildContext` and RLS on `mood_logs`).

---

## Build order summary

```
Phase 1 (profile + DB)  ─┬─► Phase 2 (onboarding)
                         ├─► Phase 3 (swipe) ─► Phase 4 (preference engine) ─┬─► Phase 5 (meal/activity engine)
                         │                                                    ├─► Phase 6 (feedback)
                         │                                                    ├─► Phase 7 (transparency)
                         │                                                    ├─► Phase 8 (micro-questions)
                         │                                                    └─► Phase 10 (dashboard DNA)
                         └─► Phase 9 (intro video, independent)
```
Phases 1–4 are the foundation and must land before 5–8/10. Phase 9 is independent and can be done anytime.

## Anti-hallucination checklist (verify before each PR)
- [ ] AI calls go through `supabase.functions.invoke('ai-proxy', { body: { type, prompt, maxTokens }})` and nothing else.
- [ ] New tables have a numbered migration + `schema.sql` update + RLS using the `children→parent_id` pattern.
- [ ] No new client env vars beyond `SUPABASE_URL` / `SUPABASE_ANON_KEY`.
- [ ] Onboarding answer IDs reused from the existing non-contiguous map; readers updated together.
- [ ] Pillars limited to `nutrition|movement|sleep|confidence`; age groups to `6-8|8-10|10-12`.
- [ ] `food_logs.action` enum NOT overloaded; 5-state meal reactions use `meal_feedback`.
- [ ] New screens registered in [src/navigation/index.tsx](src/navigation/index.tsx) `RootStackParamList`.
- [ ] No new npm dependency (esp. video) added without explicit approval.
- [ ] Styling via `StyleSheet` + `src/theme.ts` tokens, not inline magic colors where a token exists.
